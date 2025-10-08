# Fixed subscription calculation logic for your API

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
