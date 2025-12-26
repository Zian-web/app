import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from '../../hooks/use-toast';
import { Plus, Calculator, Info, AlertTriangle } from 'lucide-react';
import { useSubscriptionPermissions } from '../../hooks/useSubscriptionPermissions';
import SubscriptionGuard from '../teacher/SubscriptionGuard';
import RealTimeSubscriptionCalculator from '../teacher/RealTimeSubscriptionCalculator';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';


const AddBatchDialog = ({ open, onOpenChange, onAddBatch }) => {
  const [batchData, setBatchData] = useState({
    name: '',
    subject: '',
    schedule: '',
    startDate: '',
    endDate: '',
    student_limit: 30,
    fees: ''
  });

  // Check batch creation status after payment completion
  const checkBatchCreationStatus = async () => {
    const pendingPaymentId = localStorage.getItem('pending_payment_id');
    if (!pendingPaymentId || pendingPaymentId === 'unknown') return;

    try {
      console.log('Checking batch creation status for payment:', pendingPaymentId);
      
      const response = await api.get(`/api/teacher/batch-creation/status/${pendingPaymentId}`);
      
      if (response.batch_created) {
        console.log('Batch created successfully after payment:', response);
        
        toast({
          title: "Batch Created Successfully!",
          description: `Your batch "${response.batch_name}" has been created successfully!`,
        });
        
        // Clear stored data
        localStorage.removeItem('pending_batch_data');
        localStorage.removeItem('pending_payment_id');
        
        // Close dialog and refresh
        onOpenChange(false);
        if (onAddBatch) {
          onAddBatch({ id: response.batch_id, name: response.batch_name });
        }
        
      } else {
        console.log('Batch not created yet, still processing...');
      }
      
    } catch (error) {
      console.error('Error checking batch creation status:', error);
    }
  };

  const { canCreateBatch, subscriptionStatus, requiresPayment, loading: permissionsLoading } = useSubscriptionPermissions();
  
  // Fallback values in case the hook fails
  const safeCanCreateBatch = canCreateBatch ?? true;
  const safePermissionsLoading = permissionsLoading ?? false;
  const safeRequiresPayment = requiresPayment ?? false;

  // Check for pending batch creation on component mount
  useEffect(() => {
    const pendingPaymentId = localStorage.getItem('pending_payment_id');
    if (pendingPaymentId && pendingPaymentId !== 'unknown') {
      console.log('Found pending payment, checking batch creation status...');
      checkBatchCreationStatus();
    }
  }, []);

  // Subscription information components
  const renderSubscriptionInfo = (subscription) => {
    return (
      <div className="subscription-info bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Subscription Fee Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Maximum Student Limit:</span> {subscription.max_student_limit || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Current Enrolled:</span> {subscription.current_student_count || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Batch Fees:</span> ₹{subscription.batch_fees || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Commission per Student:</span> ₹{subscription.commission_per_student || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Monthly Fee:</span> ₹{subscription.monthly_fee || 0}
            </p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded">
          <p className="text-blue-800 text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            <strong>Note:</strong> Subscription is based on maximum student limit, not current enrollment.
          </p>
        </div>
      </div>
    );
  };

  const showSubscriptionDetails = (batch) => {
    return (
      <div className="subscription-details bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Subscription Calculation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Maximum Students:</span> {batch.max_student_limit || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Current Students:</span> {batch.current_student_count || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Monthly Fee:</span> ₹{batch.monthly_fee || 0}
            </p>
          </div>
        </div>
        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800 text-xs flex items-center gap-2">
            <Info className="h-3 w-3" />
            <strong>💡 Tip:</strong> Subscription fee is calculated based on your maximum student limit 
            ({batch.max_student_limit || 'N/A'} students), not current enrollment 
            ({batch.current_student_count || 0} students).
          </p>
        </div>
      </div>
    );
  };

  const handleAdd = async () => {
    console.log('Add Batch button clicked');
    console.log('Form data:', batchData);
    console.log('Can create batch:', canCreateBatch);
    console.log('Requires payment:', requiresPayment);
    
    if (!batchData.name || !batchData.subject) {
      toast({
        title: "Error",
        description: "Please fill at least name and subject",
        variant: "destructive"
      });
      return;
    }

    try {
      // Validate required fields
      if (!batchData.fees || batchData.fees <= 0) {
        toast({
          title: "Invalid Course Fees",
          description: "Please enter a valid course fee amount (greater than 0)",
          variant: "destructive"
        });
        return;
      }

      if (!batchData.student_limit || batchData.student_limit < 1) {
        toast({
          title: "Invalid Student Limit",
          description: "Please enter a valid student limit (at least 1)",
          variant: "destructive"
        });
        return;
      }

      // Validate minimum subscription requirements
      const fees = parseInt(batchData.fees);
      const studentLimit = parseInt(batchData.student_limit);
      
      // Check if fees are too low for subscription calculation
      if (fees < 100) {
        toast({
          title: "Course Fees Too Low",
          description: "Course fees must be at least ₹100 for subscription calculation",
          variant: "destructive"
        });
        return;
      }

      // Check if student limit is reasonable
      if (studentLimit < 5) {
        toast({
          title: "Student Limit Too Low",
          description: "Student limit must be at least 5 for subscription calculation",
          variant: "destructive"
        });
        return;
      }

      // Map frontend fields to backend expected fields
      const mappedData = {
        name: batchData.name,
        subject: batchData.subject,
        description: batchData.schedule || null,
        fees: parseInt(batchData.fees),
        max_students: parseInt(batchData.student_limit),
        start_date: batchData.startDate || null,
        end_date: batchData.endDate || null
      };
      
      // Calculate expected subscription fee for debugging
      const expectedSubscriptionFee = Math.max(
        mappedData.max_students * 35, // ₹35 per student minimum
        mappedData.fees * 0.07 // 7% of batch fees
      );
      
      console.log('Creating batch with payment-first flow:', mappedData);
      console.log('Validation - Fees:', mappedData.fees, 'Max Students:', mappedData.max_students);
      console.log('Expected subscription fee:', expectedSubscriptionFee);
      
      // Call the new payment-first API endpoint
      const response = await api.post('/api/teacher/batch/create-with-payment', mappedData);
      
      console.log('Batch creation response:', response);
      
      if (response.payment_required) {
        // Payment required - redirect to Razorpay
        console.log('Payment required, redirecting to:', response.payment_link_url);
        
        toast({
          title: "Payment Required",
          description: `Please complete payment of ₹${response.amount} to create your batch "${batchData.name}"`,
        });
        
        // Store batch data for after payment completion
        localStorage.setItem('pending_batch_data', JSON.stringify(mappedData));
        localStorage.setItem('pending_payment_id', response.payment_id || 'unknown');
        
        // Redirect to Razorpay payment page
        window.location.href = response.payment_link_url;
        
      } else {
        // Beta enabled - batch created directly
        console.log('Batch created directly (beta enabled):', response.batch);
        
        toast({
          title: "Batch Created Successfully",
          description: `Your batch "${response.batch.name}" has been created successfully!`,
        });
        
        // Reset form and close dialog
        setBatchData({ name: '', subject: '', schedule: '', startDate: '', endDate: '', student_limit: 30, fees: '' });
        onOpenChange(false);
        
        // Refresh the parent component to show the new batch
        if (onAddBatch) {
          onAddBatch(response.batch);
        }
      }
      
    } catch (error) {
      console.error('Error creating batch:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = "Failed to create batch. Please try again.";
      
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Batch Creation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };


  console.log('AddBatchDialog render:', { 
    open, 
    canCreateBatch, 
    permissionsLoading, 
    requiresPayment,
    subscriptionStatus: subscriptionStatus ? 'loaded' : 'null'
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Batch</DialogTitle>
          <DialogDescription>Fill in the details to create a new batch.</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-3 max-h-[65vh] overflow-y-auto">
          
          {/* Show subscription warning if needed */}
          {!safeCanCreateBatch && !safePermissionsLoading && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <h4 className="font-semibold">Subscription Required</h4>
                  <p className="text-sm">
                    {safeRequiresPayment 
                      ? "You need to complete your subscription payment before creating new batches."
                      : "You need an active subscription to create new batches."
                    }
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        onOpenChange(false);
                        window.location.href = '/teacher/dashboard?tab=subscription';
                      }}
                    >
                      {safeRequiresPayment ? 'Pay Subscription' : 'Create Subscription'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Always show form fields */}
          <div>
            {console.log('Rendering form fields, permissions:', { canCreateBatch, permissionsLoading })}
            <Label htmlFor="name">Batch Name</Label>
            <Input 
              id="name" 
              value={batchData.name} 
              onChange={(e) => setBatchData({...batchData, name: e.target.value})} 
              placeholder="Enter batch name" 
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              value={batchData.subject} 
              onChange={(e) => setBatchData({...batchData, subject: e.target.value})} 
              placeholder="Enter subject" 
            />
          </div>
          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Input 
              id="schedule" 
              value={batchData.schedule} 
              onChange={(e) => setBatchData({...batchData, schedule: e.target.value})} 
              placeholder="Mon/Wed/Fri 10AM-12PM" 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                type="date" 
                id="startDate" 
                value={batchData.startDate} 
                onChange={(e) => setBatchData({...batchData, startDate: e.target.value})} 
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                type="date" 
                id="endDate" 
                value={batchData.endDate} 
                onChange={(e) => setBatchData({...batchData, endDate: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_limit">Maximum Students</Label>
              <Input 
                type="number" 
                id="student_limit" 
                value={batchData.student_limit} 
                onChange={(e) => setBatchData({...batchData, student_limit: parseInt(e.target.value)})} 
                min="1"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="fees">Course Fees</Label>
              <Input 
                type="number" 
                id="fees" 
                value={batchData.fees} 
                onChange={(e) => setBatchData({...batchData, fees: parseFloat(e.target.value) || 0})} 
                placeholder="Enter course fees"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          
          {/* Real-time Subscription Calculator */}
          {(batchData.student_limit || batchData.fees) && (
            <div className="mt-4">
              <RealTimeSubscriptionCalculator
                batchFees={parseFloat(batchData.fees) || 0}
                studentLimit={batchData.student_limit || 0}
                currentStudents={0} // New batch starts with 0 students
                onCalculationChange={(calculation) => {
                  // Store the calculated subscription fee for use in batch creation
                  setBatchData(prev => ({
                    ...prev,
                    calculatedSubscriptionFee: calculation.totalSubscription
                  }));
                }}
              />
            </div>
          )}
          
          <div className="sticky bottom-0 bg-white border-t pt-4 mt-4">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button 
                onClick={handleAdd}
                disabled={!batchData.name || !batchData.subject}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Batch
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBatchDialog;
