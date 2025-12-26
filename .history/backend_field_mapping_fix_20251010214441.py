# Backend Field Mapping Fix
# Add this to your main API file to handle both field names

@app.post("/api/teacher/batch/create-with-payment")
async def create_batch_with_payment(
    batch: schemas.BatchCreate, 
    db: Session = Depends(get_db), 
    current_teacher: models.Teacher = Depends(get_current_teacher)
):
    """Create batch with payment-first flow when beta is off"""
    try:
        # Check if beta testing is disabled
        beta_enabled = is_beta_testing_enabled(db)
        if not beta_enabled:
            # Handle both field names for backward compatibility
            student_limit = getattr(batch, 'student_limit', None) or getattr(batch, 'max_students', None) or 30
            
            # Calculate subscription fee for this batch
            from subscription_utils import SubscriptionCalculator
            
            # Calculate subscription fee based on batch fees and student count
            subscription_data = SubscriptionCalculator.calculate_subscription_fee_for_new_batch(
                db, current_teacher.id, batch.fees or 0, student_limit
            )
            
            print(f"Subscription calculation result: {subscription_data}")
            print(f"Student limit used: {student_limit}")
            total_subscription_fee = subscription_data["total_subscription"]
            
            # For beta disabled, we should always have a subscription fee
            if total_subscription_fee <= 0:
                # If calculation returns 0, use minimum fee
                total_subscription_fee = 700  # Base fee
                print(f"Using minimum fee: {total_subscription_fee}")
            
            try:
                # Create Razorpay payment link for subscription
                payment_link_data = {
                    "amount": total_subscription_fee * 100,  # Convert to paise
                    "currency": "INR",
                    "description": f"Subscription payment for batch '{batch.name}' - {batch.subject}",
                    "customer": {
                        "name": current_teacher.full_name,
                        "email": current_teacher.email,
                    },
                    "notify": {"sms": True, "email": True},
                    "reminder_enable": True,
                    "notes": {
                        "teacher_id": str(current_teacher.id),
                        "batch_name": batch.name,
                        "batch_subject": batch.subject,
                        "batch_fees": str(batch.fees or 0),
                        "max_students": str(student_limit),
                        "payment_type": "batch_creation_subscription",
                        "subscription_fee": str(total_subscription_fee)
                    },
                    "callback_url": f"http://localhost:9000/api/batch-creation/callback",
                    "callback_method": "get"
                }
                
                payment_link = razorpay_client.payment_link.create(payment_link_data)
                
                # Store batch data temporarily for after payment
                batch_data = {
                    "name": batch.name,
                    "subject": batch.subject,
                    "description": getattr(batch, 'description', None),
                    "fees": batch.fees,
                    "max_students": student_limit,  # Use the resolved student limit
                    "teacher_id": current_teacher.id,
                    "subscription_fee": total_subscription_fee
                }
                
                return {
                    "payment_required": True,
                    "payment_link_url": payment_link['short_url'],
                    "amount": total_subscription_fee,
                    "batch_data": batch_data,
                    "message": "Please complete payment to create your batch"
                }
                
            except Exception as e:
                print(f"Error creating payment link for batch creation: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Failed to create payment link: {str(e)}")
        
        else:
            # If beta is enabled, create batch directly
            # Handle both field names for backward compatibility
            student_limit = getattr(batch, 'student_limit', None) or getattr(batch, 'max_students', None) or 30
            
            batch_data = batch.model_dump()
            batch_data['student_limit'] = student_limit  # Ensure student_limit is set
            
            new_batch = models.Batch(**batch_data, teacher_id=current_teacher.id)
            db.add(new_batch)
            db.commit()
            db.refresh(new_batch)
            
            return {
                "payment_required": False,
                "batch": new_batch,
                "message": "Batch created successfully (beta testing enabled)"
            }
    
    except Exception as e:
        print(f"Error in create_batch_with_payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating batch: {str(e)}")

# Also update the regular batch creation endpoint
@app.post("/api/batches/", response_model=schemas.BatchResponse)
async def create_batch(batch: schemas.BatchCreate, db: Session = Depends(get_db), current_teacher: models.Teacher = Depends(get_current_teacher)):
    # Handle both field names for backward compatibility
    student_limit = getattr(batch, 'student_limit', None) or getattr(batch, 'max_students', None) or 30
    
    # Update the batch data to ensure student_limit is set
    batch_data = batch.model_dump()
    batch_data['student_limit'] = student_limit
    
    new_batch = models.Batch(**batch_data, teacher_id=current_teacher.id)
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)

    # Rest of the batch creation logic...
    return new_batch
