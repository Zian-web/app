# Real-Time Subscription Calculation API Endpoints
# Add these to your main API file

def calculate_real_time_subscription(batch_fees: int, student_limit: int, current_students: int = 0) -> dict:
    """
    Real-time subscription calculation with proper max(35, 7% of fees) logic:
    - Minimum ₹35 per student
    - 7% of batch fees (if higher than ₹35)
    - Uses student_limit for subscription calculation
    - Shows step-by-step calculation
    """
    min_per_student = 35
    commission_rate = 7  # 7%
    min_students = 20
    
    # Calculate 7% of batch fees
    seven_percent_amount = (batch_fees * commission_rate) / 100 if batch_fees > 0 else 0
    
    # Calculate commission per student: max(7% of batch fees, ₹35)
    commission_per_student = max(seven_percent_amount, min_per_student)
    
    # Use student_limit for subscription calculation (minimum 20 students)
    effective_student_count = max(student_limit, min_students)
    
    # Calculate total subscription
    total_subscription = commission_per_student * effective_student_count
    
    # Determine which calculation was used
    is_seven_percent_higher = seven_percent_amount > min_per_student
    
    return {
        "batch_fees": batch_fees,
        "student_limit": student_limit,
        "current_students": current_students,
        "seven_percent_amount": round(seven_percent_amount, 2),
        "min_per_student": min_per_student,
        "commission_per_student": round(commission_per_student, 2),
        "effective_student_count": effective_student_count,
        "total_subscription": round(total_subscription, 2),
        "is_seven_percent_higher": is_seven_percent_higher,
        "calculation_steps": {
            "step1": f"7% of ₹{batch_fees} = ₹{round(seven_percent_amount, 2)}",
            "step2": f"max(₹{round(seven_percent_amount, 2)}, ₹{min_per_student}) = ₹{round(commission_per_student, 2)}",
            "step3": f"₹{round(commission_per_student, 2)} × {effective_student_count} students = ₹{round(total_subscription, 2)}"
        },
        "logic_explanation": f"Commission per student = max(7% of batch fees, ₹35). Total subscription = Commission per student × max(student_limit, 20 students). {'7% of fees is higher' if is_seven_percent_higher else 'Minimum ₹35 is higher'}."
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
    calculation = calculate_real_time_subscription(batch_fees, student_limit, current_students)
    
    return {
        "success": True,
        "calculation": calculation,
        "beta_testing_enabled": is_beta_testing_enabled(db),
        "message": "Real-time subscription calculation completed"
    }

@app.get("/api/subscription/calculate-batch/{batch_id}")
async def calculate_batch_subscription_real_time(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Calculate real-time subscription for an existing batch"""
    if current_user["type"] != "teacher":
        raise HTTPException(status_code=403, detail="Access denied: requires teacher role")
    
    # Get batch details
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    # Get current student count
    current_student_count = db.query(models.BatchStudent).filter(
        models.BatchStudent.batch_id == batch_id,
        models.BatchStudent.status == models.JoinRequestStatus.approved
    ).count()
    
    # Calculate real-time subscription
    calculation = calculate_real_time_subscription(
        batch.fees or 0,
        batch.student_limit or 0,
        current_student_count
    )
    
    return {
        "success": True,
        "batch_id": batch_id,
        "batch_name": batch.name,
        "batch_fees": batch.fees or 0,
        "student_limit": batch.student_limit or 0,
        "current_students": current_student_count,
        "calculation": calculation,
        "beta_testing_enabled": is_beta_testing_enabled(db)
    }

@app.post("/api/subscription/validate-calculation")
async def validate_subscription_calculation(
    request: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Validate subscription calculation with custom parameters"""
    if current_user["type"] != "teacher":
        raise HTTPException(status_code=403, detail="Access denied: requires teacher role")
    
    batch_fees = request.get("batch_fees", 0)
    student_limit = request.get("student_limit", 0)
    current_students = request.get("current_students", 0)
    
    # Validate inputs
    if batch_fees < 0:
        raise HTTPException(status_code=400, detail="Batch fees cannot be negative")
    if student_limit < 1:
        raise HTTPException(status_code=400, detail="Student limit must be at least 1")
    if current_students < 0:
        raise HTTPException(status_code=400, detail="Current students cannot be negative")
    
    # Calculate subscription
    calculation = calculate_real_time_subscription(batch_fees, student_limit, current_students)
    
    return {
        "success": True,
        "validation": {
            "is_valid": True,
            "calculation": calculation,
            "recommendations": []
        },
        "beta_testing_enabled": is_beta_testing_enabled(db)
    }

# Enhanced subscription calculation for existing batches
@app.get("/api/teacher/subscription/calculate-all-batches")
async def calculate_all_batches_subscription(
    db: Session = Depends(get_db),
    current_teacher: models.Teacher = Depends(get_current_teacher)
):
    """Calculate subscription for all teacher's batches"""
    # Get all batches for the teacher
    batches = db.query(models.Batch).filter(models.Batch.teacher_id == current_teacher.id).all()
    
    batch_calculations = []
    total_monthly_subscription = 0
    
    for batch in batches:
        # Get current student count
        current_student_count = db.query(models.BatchStudent).filter(
            models.BatchStudent.batch_id == batch.id,
            models.BatchStudent.status == models.JoinRequestStatus.approved
        ).count()
        
        # Calculate subscription
        calculation = calculate_real_time_subscription(
            batch.fees or 0,
            batch.student_limit or 0,
            current_student_count
        )
        
        batch_calculations.append({
            "batch_id": batch.id,
            "batch_name": batch.name,
            "batch_fees": batch.fees or 0,
            "student_limit": batch.student_limit or 0,
            "current_students": current_student_count,
            "calculation": calculation
        })
        
        total_monthly_subscription += calculation["total_subscription"]
    
    return {
        "success": True,
        "teacher_id": current_teacher.id,
        "total_batches": len(batches),
        "total_monthly_subscription": round(total_monthly_subscription, 2),
        "batch_calculations": batch_calculations,
        "beta_testing_enabled": is_beta_testing_enabled(db)
    }
