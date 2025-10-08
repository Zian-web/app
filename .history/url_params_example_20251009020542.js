// Example of how to use URL parameters for batch creation success/error messages

// 1. In your API callback (e.g., batch-creation/callback endpoint)
// After successful batch creation, redirect with success parameters:
const successRedirectUrl = `http://localhost:3002/teacher/dashboard?batch_created=true&batch_id=${new_batch.id}&batch_name=${encodeURIComponent(new_batch.name)}&message=${encodeURIComponent('Your batch has been created successfully!')}`;
return RedirectResponse(url=successRedirectUrl);

// 2. In your API callback for failed batch creation:
const errorRedirectUrl = `http://localhost:3002/teacher/dashboard?error=${encodeURIComponent('Failed to create batch. Please try again.')}`;
return RedirectResponse(url=errorRedirectUrl);

// 3. For student batch join success:
const joinSuccessUrl = `http://localhost:3002/student/dashboard?batch_joined=true&batch_id=${batch.id}&batch_name=${encodeURIComponent(batch.name)}&message=${encodeURIComponent('You have successfully joined the batch!')}`;
return RedirectResponse(url=joinSuccessUrl);

// 4. For student batch join failure:
const joinErrorUrl = `http://localhost:3002/student/dashboard?error=${encodeURIComponent('Failed to join batch. Batch may be full or access denied.')}`;
return RedirectResponse(url=joinErrorUrl);

// 5. Example usage in your API endpoints:

@app.get("/api/batch-creation/callback")
async def batch_creation_payment_callback(
    razorpay_payment_id: str = Query(...),
    razorpay_payment_link_id: str = Query(...),
    razorpay_payment_link_reference_id: str = Query(...),
    razorpay_payment_link_status: str = Query(...),
    razorpay_signature: str = Query(...),
    db: Session = Depends(get_db)
):
    """Handle successful payment for batch creation and create the batch"""
    try:
        # ... your existing batch creation logic ...
        
        if batch_created_successfully:
            # Redirect to dashboard with success parameters
            success_url = f"http://localhost:3002/teacher/dashboard?batch_created=true&batch_id={new_batch.id}&batch_name={new_batch.name}&message=Your batch has been created successfully!"
            return RedirectResponse(url=success_url)
        else:
            # Redirect to dashboard with error
            error_url = f"http://localhost:3002/teacher/dashboard?error=Failed to create batch. Please try again."
            return RedirectResponse(url=error_url)
            
    except Exception as e:
        # Redirect to dashboard with error
        error_url = f"http://localhost:3002/teacher/dashboard?error={str(e)}"
        return RedirectResponse(url=error_url)

@app.post("/api/student/batches/join")
def join_batch(join_request: schemas.StudentJoinRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Student joins a batch"""
    try:
        # ... your existing join logic ...
        
        if join_successful:
            # Redirect to student dashboard with success parameters
            success_url = f"http://localhost:3002/student/dashboard?batch_joined=true&batch_id={batch.id}&batch_name={batch.name}&message=You have successfully joined the batch!"
            return RedirectResponse(url=success_url)
        else:
            # Redirect to student dashboard with error
            error_url = f"http://localhost:3002/student/dashboard?error=Failed to join batch. Batch may be full or access denied."
            return RedirectResponse(url=error_url)
            
    except Exception as e:
        # Redirect to student dashboard with error
        error_url = f"http://localhost:3002/student/dashboard?error={str(e)}"
        return RedirectResponse(url=error_url)

// 6. Frontend usage examples:

// In TeacherDashboard.jsx - already implemented with useBatchCreationMessages hook
// The hook automatically handles:
// - batch_created=true
// - batch_id
// - batch_name  
// - message
// - error

// In StudentDashboard.jsx - already implemented with useBatchJoinMessages hook
// The hook automatically handles:
// - batch_joined=true
// - batch_id
// - batch_name
// - message
// - error

// 7. Manual URL parameter handling (if you need custom logic):

const handleUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const batchCreated = urlParams.get('batch_created');
  const batchId = urlParams.get('batch_id');
  const batchName = urlParams.get('batch_name');
  const message = urlParams.get('message');
  const error = urlParams.get('error');

  if (batchCreated === 'true') {
    showSuccessMessage(`${message} Batch ID: ${batchId}`);
  } else if (error) {
    showErrorMessage(error);
  }
};

// 8. Clean up URL parameters manually:
const cleanUrlParams = () => {
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('batch_created');
  newUrl.searchParams.delete('batch_id');
  newUrl.searchParams.delete('batch_name');
  newUrl.searchParams.delete('message');
  newUrl.searchParams.delete('error');
  window.history.replaceState({}, '', newUrl);
};
