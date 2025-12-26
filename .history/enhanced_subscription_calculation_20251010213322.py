# Enhanced Subscription Calculation with Real-Time Logic
# Add this to your main API file

def calculate_batch_subscription_fee(batch_fees: int, student_count: int, student_limit: int) -> dict:
    """
    Calculate subscription fee based on the correct logic:
    - Minimum ₹35 per student
    - 7% of batch fees (if higher than ₹35)
    - Uses student_limit for subscription calculation
    - Shows real-time calculation breakdown
    """
    min_students = 20
    min_per_student = 35
    commission_rate = 7  # 7%
    
    # Calculate 7% of batch fees per student
    seven_percent_amount = (batch_fees * commission_rate) / 100 if batch_fees > 0 else 0
    
    # Calculate commission per student: max(7% of batch fees, ₹35)
    commission_per_student = max(seven_percent_amount, min_per_student)
    
    # Use student_limit for subscription calculation (minimum 20 students)
    effective_student_count = max(student_limit, min_students)
    
    # Calculate total subscription fee
    total_subscription = commission_per_student * effective_student_count
    
    # Determine which calculation was used
    is_seven_percent_higher = seven_percent_amount > min_per_student
    
    return {
        "commission_per_student": round(commission_per_student, 2),
        "student_count": effective_student_count,
        "total_subscription": round(total_subscription, 2),
        "minimum_met": student_count >= min_students,
        "batch_fees": batch_fees,
        "commission_rate": commission_rate,
        "seven_percent_amount": round(seven_percent_amount, 2),
        "min_per_student": min_per_student,
        "is_seven_percent_higher": is_seven_percent_higher,
        "calculation_steps": {
            "step1": f"7% of ₹{batch_fees} = ₹{round(seven_percent_amount, 2)}",
            "step2": f"max(₹{round(seven_percent_amount, 2)}, ₹{min_per_student}) = ₹{round(commission_per_student, 2)}",
            "step3": f"₹{round(commission_per_student, 2)} × {effective_student_count} students = ₹{round(total_subscription, 2)}"
        },
        "logic_explanation": f"Commission per student = max(7% of batch fees, ₹35). Total subscription = Commission per student × max(student_limit, 20 students). {'7% of fees is higher' if is_seven_percent_higher else 'Minimum ₹35 is higher'}.",
        "batch_price_per_student": batch_fees,  # Show actual batch price
        "commission_calculation": f"max({commission_rate}% of ₹{batch_fees}, ₹{min_per_student}) = ₹{round(commission_per_student, 2)} per student",
        "total_calculation": f"₹{round(commission_per_student, 2)} × {effective_student_count} students = ₹{round(total_subscription, 2)}",
        "current_students": student_count,  # Show actual current students
        "subscription_based_on": f"teacher-set limit of {student_limit} students"  # Clarify what the calculation is based on
    }

@app.get("/api/subscription/calculate/{batch_id}")
async def calculate_batch_subscription(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Calculate subscription fee for a batch with real-time logic"""
    if current_user["type"] != "teacher":
        raise HTTPException(status_code=403, detail="Access denied: requires teacher role")
    
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    # Get current enrolled student count
    current_student_count = db.query(models.BatchStudent).filter(
        models.BatchStudent.batch_id == batch_id,
        models.BatchStudent.status == models.JoinRequestStatus.approved
    ).count()
    
    # Calculate subscription fee with enhanced logic
    subscription_data = calculate_batch_subscription_fee(
        batch.fees or 0, 
        current_student_count, 
        batch.student_limit or 0
    )
    
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
        "minimum_met": subscription_data["minimum_met"],
        "beta_testing_enabled": is_beta_testing_enabled(db)
    }

@app.post("/api/teacher/subscription/recalculate/{batch_id}")
async def recalculate_subscription_fee(
    batch_id: int,
    db: Session = Depends(get_db),
    current_teacher: models.Teacher = Depends(get_current_teacher)
):
    """Recalculate subscription fee for a batch with real-time logic"""
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
    
    # Calculate subscription fee using enhanced logic
    subscription_data = calculate_batch_subscription_fee(
        batch.fees or 0, 
        current_student_count, 
        batch.student_limit or 0
    )
    
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

@app.get("/api/subscription/calculate-real-time")
async def calculate_real_time_subscription_endpoint(
    batch_fees: int = Query(0, description="Batch fees in rupees"),
    student_limit: int = Query(0, description="Maximum number of students"),
    current_students: int = Query(0, description="Current number of enrolled students"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Calculate real-time subscription fee with detailed breakdown"""
    if current_user["type"] != "teacher":
        raise HTTPException(status_code=403, detail="Access denied: requires teacher role")
    
    # Validate inputs
    if batch_fees < 0:
        raise HTTPException(status_code=400, detail="Batch fees cannot be negative")
    if student_limit < 1:
        raise HTTPException(status_code=400, detail="Student limit must be at least 1")
    if current_students < 0:
        raise HTTPException(status_code=400, detail="Current students cannot be negative")
    
    # Calculate subscription
    calculation = calculate_batch_subscription_fee(batch_fees, current_students, student_limit)
    
    return {
        "success": True,
        "calculation": calculation,
        "beta_testing_enabled": is_beta_testing_enabled(db),
        "message": "Real-time subscription calculation completed"
    }
