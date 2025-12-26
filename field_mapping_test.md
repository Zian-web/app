# Field Mapping Test

## Problem
When creating a batch with 40 students, the backend receives 30 students instead.

## Root Cause
The frontend was sending `max_students` but the backend expects `student_limit`.

## Fix Applied

### 1. Frontend Fix (AddBatchDialog.jsx)
```javascript
// Before (WRONG):
const mappedData = {
  max_students: parseInt(batchData.student_limit),
  // ... other fields
};

// After (CORRECT):
const mappedData = {
  student_limit: parseInt(batchData.student_limit),
  // ... other fields
};
```

### 2. Input Field Fix
```javascript
// Before (could cause NaN):
onChange={(e) => setBatchData({...batchData, student_limit: parseInt(e.target.value)})}

// After (handles empty/invalid input):
onChange={(e) => {
  const value = parseInt(e.target.value) || 0;
  setBatchData({...batchData, student_limit: value});
}}
```

### 3. Backend Compatibility Fix
```python
# Handle both field names for backward compatibility
student_limit = getattr(batch, 'student_limit', None) or getattr(batch, 'max_students', None) or 30
```

## Testing Steps

1. **Open Add Batch Dialog**
2. **Enter the following values:**
   - Batch Name: "Test Batch"
   - Subject: "Mathematics"
   - Maximum Students: 40
   - Course Fees: 699.74

3. **Check Browser Console:**
   - Should see: `Student limit input changed: 40 parsed: 40`
   - Should see: `Frontend batchData.student_limit: 40`
   - Should see: `Parsed student_limit: 40`

4. **Check Network Tab:**
   - Request payload should contain: `"student_limit": 40`
   - NOT: `"max_students": 40`

5. **Check Backend Logs:**
   - Should see: `Student limit used: 40`
   - Should see subscription calculation for 40 students

## Expected Results

- **Frontend**: Real-time calculator shows calculation for 40 students
- **Backend**: Receives `student_limit: 40` in the request
- **Database**: Batch created with `student_limit = 40`
- **Subscription**: Calculated based on 40 students, not 30

## Debug Console Output

When working correctly, you should see:
```
Student limit input changed: 40 parsed: 40
Frontend batchData.student_limit: 40
Parsed student_limit: 40
Creating batch with payment-first flow: {student_limit: 40, fees: 699, ...}
Student limit used: 40
```

## Verification

The subscription calculation should show:
- **Commission per student**: ₹48.98 (7% of ₹699.74)
- **Effective students**: 40
- **Monthly subscription**: ₹1,959.20 (₹48.98 × 40)
