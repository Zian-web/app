# Add these corrected endpoints to your main API file

# Fixed subscription calculation function
def calculate_subscription_fee(batch_fees: int, student_count: int) -> dict:
    """
    Calculate subscription fee based on:
    - Minimum 20 students
    - Minimum ₹35 per student
    - 7% of batch fees (if higher than ₹35)
    """
    min_students = 20
    min_per_student = 35
    commission_rate = 7  # 7%
    
    # Calculate 7% of batch fees per student
    if batch_fees and batch_fees > 0:
        commission_per_student = max(int(batch_fees * commission_rate / 100), min_per_student)
    else:
        commission_per_student = min_per_student
    
    # Use actual student count or minimum 20
    effective_student_count = max(student_count, min_students)
    
    # Calculate total subscription fee
    total_subscription = commission_per_student * effective_student_count
    
    return {
        "commission_per_student": commission_per_student,
        "student_count": effective_student_count,
        "total_subscription": total_subscription,
        "minimum_met": student_count >= min_students,
        "batch_fees": batch_fees,
        "commission_rate": commission_rate
    }

# Fixed endpoint for calculating subscription fee
@app.get("/api/subscription/calculate/{batch_id}")
async def calculate_batch_subscription(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Calculate subscription fee for a batch"""
    if current_user["type"] != "teacher":
        raise HTTPException(status_code=403, detail="Access denied: requires teacher role")
    
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    # Get student count for this batch
    student_count = db.query(models.BatchStudent).filter(
        models.BatchStudent.batch_id == batch_id,
        models.BatchStudent.status == models.JoinRequestStatus.approved
    ).count()
    
    # Calculate subscription fee
    subscription_data = calculate_subscription_fee(batch.fees or 0, student_count)
    
    return {
        "batch_id": batch_id,
        "batch_name": batch.name,
        "batch_fees": batch.fees or 0,
        "student_limit": batch.student_limit or 0,
        "current_student_count": student_count,
        "subscription_calculation": subscription_data,
        "beta_testing_enabled": is_beta_testing_enabled(db)
    }

# Fixed endpoint for recalculating subscription fee
@app.post("/api/teacher/subscription/recalculate/{batch_id}")
async def recalculate_subscription_fee(
    batch_id: int,
    db: Session = Depends(get_db),
    current_teacher: models.Teacher = Depends(get_current_teacher)
):
    """Recalculate subscription fee for a batch"""
    # Verify batch belongs to teacher
    batch = db.query(models.Batch).filter(
        models.Batch.id == batch_id,
        models.Batch.teacher_id == current_teacher.id
    ).first()
    
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    # Get current enrolled student count
    current_student_count = db.query(models.BatchStudent).filter(
        models.BatchStudent.batch_id == batch_id,
        models.BatchStudent.status == models.JoinRequestStatus.approved
    ).count()
    
    # Calculate subscription fee using the actual logic
    subscription_data = calculate_subscription_fee(batch.fees or 0, current_student_count)
    
    # Update existing subscription if it exists
    existing_subscription = db.query(models.TeacherSubscription).filter(
        models.TeacherSubscription.batch_id == batch_id,
        models.TeacherSubscription.status == "active"
    ).first()
    
    if existing_subscription:
        existing_subscription.monthly_fee = subscription_data["total_subscription"]
        existing_subscription.student_count = current_student_count
        db.commit()
    
    return {
        "batch_id": batch_id,
        "batch_name": batch.name,
        "batch_fees": batch.fees or 0,
        "student_limit": batch.student_limit or 0,
        "current_student_count": current_student_count,
        "subscription_calculation": subscription_data,
        "monthly_fee": subscription_data["total_subscription"],
        "commission_per_student": subscription_data["commission_per_student"],
        "effective_student_count": subscription_data["student_count"],
        "minimum_met": subscription_data["minimum_met"]
    }

# Fixed teacher subscription status endpoint
@app.get("/api/teacher/subscription/status")
def get_teacher_subscription_status(
    db: Session = Depends(get_db), 
    current_teacher: models.Teacher = Depends(get_current_teacher)
):
    """Get teacher's subscription status with proper calculation"""
    try:
        # Get teacher's subscriptions
        subscriptions = db.query(models.TeacherSubscription).join(models.Batch).filter(
            models.Batch.teacher_id == current_teacher.id,
            models.TeacherSubscription.status == "active"
        ).all()
        
        if not subscriptions:
            return {
                "has_subscription": False,
                "subscription_active": False,
                "subscriptions": [],
                "subscription_count": 0,
                "due_count": 0,
                "message": "No active subscriptions found"
            }
        
        # Process each subscription
        processed_subscriptions = []
        for subscription in subscriptions:
            batch = db.query(models.Batch).filter(models.Batch.id == subscription.batch_id).first()
            if not batch:
                continue
                
            # Get current student count
            current_student_count = db.query(models.BatchStudent).filter(
                models.BatchStudent.batch_id == subscription.batch_id,
                models.BatchStudent.status == models.JoinRequestStatus.approved
            ).count()
            
            # Recalculate subscription fee
            subscription_calculation = calculate_subscription_fee(batch.fees or 0, current_student_count)
            
            # Check if subscription payment is due
            is_due = False
            if subscription.next_billing_date:
                from datetime import date
                current_date = date.today()
                is_due = subscription.next_billing_date <= current_date
            
            processed_subscription = {
                "subscription_id": subscription.id,
                "batch_id": subscription.batch_id,
                "batch_name": batch.name,
                "monthly_fee": subscription_calculation["total_subscription"],
                "student_count": current_student_count,
                "student_limit": batch.student_limit or 0,
                "batch_fees": batch.fees or 0,
                "commission_per_student": subscription_calculation["commission_per_student"],
                "start_date": subscription.start_date,
                "end_date": subscription.end_date,
                "next_billing_date": subscription.next_billing_date,
                "is_due": is_due,
                "payment_status": "paid" if not is_due else "due"
            }
            
            processed_subscriptions.append(processed_subscription)
        
        return {
            "has_subscription": True,
            "subscription_active": True,
            "subscriptions": processed_subscriptions,
            "subscription_count": len(processed_subscriptions),
            "due_count": len([s for s in processed_subscriptions if s["is_due"]]),
            "message": f"Teacher has {len(processed_subscriptions)} active subscription(s)"
        }
        
    except Exception as e:
        print(f"Error getting subscription status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting subscription status: {str(e)}")

# Fixed teacher subscription metrics endpoint
@app.get("/api/teacher/subscription/metrics")
def get_teacher_subscription_metrics(
    db: Session = Depends(get_db), 
    current_teacher: models.Teacher = Depends(get_current_teacher)
):
    """Get teacher's subscription metrics with proper calculation"""
    try:
        # Get all batches for this teacher
        batches = db.query(models.Batch).filter(models.Batch.teacher_id == current_teacher.id).all()
        
        total_students = 0
        total_batches = len(batches)
        total_fees = 0
        
        for batch in batches:
            # Count approved students
            student_count = db.query(models.BatchStudent).filter(
                models.BatchStudent.batch_id == batch.id,
                models.BatchStudent.status == models.JoinRequestStatus.approved
            ).count()
            
            total_students += student_count
            total_fees += batch.fees or 0
        
        # Calculate average fee per student
        average_fee_per_student = total_fees / total_students if total_students > 0 else 0
        
        return {
            "total_students": total_students,
            "total_batches": total_batches,
            "average_fee_per_student": int(average_fee_per_student),
            "total_fees": total_fees
        }
        
    except Exception as e:
        print(f"Error getting subscription metrics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting subscription metrics: {str(e)}")
