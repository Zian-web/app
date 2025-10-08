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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentBlock, setShowPaymentBlock] = useState(false);

  const { canCreateBatch, subscriptionStatus, requiresPayment, loading: permissionsLoading } = useSubscriptionPermissions();

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
      <div className="subscription-details bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Subscription Calculation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
        <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800 text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
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

    // Netflix-style payment flow: Show payment block for new batch creation
    if (!canCreateBatch && !permissionsLoading) {
      setShowPaymentBlock(true);
      return;
    }

    try {
      // Map frontend fields to backend expected fields
      const mappedData = {
        name: batchData.name,
        subject: batchData.subject,
        schedule: batchData.schedule || null,
        student_limit: batchData.student_limit || 30,
        fees: batchData.fees ? parseInt(batchData.fees) : null,
        start_date: batchData.startDate || null,
        end_date: batchData.endDate || null
      };
      
      // Pass the mapped data up to the parent to handle the API call
      await onAddBatch(mappedData);
      // Reset form and close dialog on success (as signaled by parent)
      setBatchData({ name: '', subject: '', schedule: '', startDate: '', endDate: '', student_limit: 30, fees: '' });
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding batch:', error);
      
      // Handle subscription-related errors
      if (error.message && error.message.includes('Subscription required')) {
        setShowPaymentBlock(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to create batch. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePaymentForBatch = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Calculate subscription fee for this specific batch
      const monthlyFee = Math.max(
        batchData.student_limit * 35, // ₹35 per student minimum
        (parseFloat(batchData.fees) || 0) * 0.07 // 7% of batch fees
      );
      
      console.log('Processing payment for batch:', {
        batchName: batchData.name,
        studentLimit: batchData.student_limit,
        fees: batchData.fees,
        monthlyFee: monthlyFee
      });
      
      // Create subscription for this specific batch
      const response = await api.post(ENDPOINTS.SUBSCRIPTION.TEACHER.CREATE, {
        batch_name: batchData.name,
        student_limit: batchData.student_limit,
        fees: batchData.fees,
        monthly_fee: monthlyFee
      });
      
      if (response.subscription_id) {
        // Process payment for this subscription
        const paymentUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/teacher/subscription/payment?subscription_id=${response.subscription_id}&months=1`;
        
        toast({
          title: "Redirecting to Payment",
          description: `Please complete payment of ₹${monthlyFee} to create your batch "${batchData.name}"`,
        });
        
        // Redirect to payment page
        window.location.href = paymentUrl;
      }
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  console.log('AddBatchDialog render:', { open, canCreateBatch, permissionsLoading, requiresPayment });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Batch</DialogTitle>
          <DialogDescription>Fill in the details to create a new batch.</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          
          {/* Show subscription warning if needed */}
          {!canCreateBatch && !permissionsLoading && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <h4 className="font-semibold">Subscription Required</h4>
                  <p className="text-sm">
                    {requiresPayment 
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
                      {requiresPayment ? 'Pay Subscription' : 'Create Subscription'}
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
          
          {/* Netflix-style Payment Block */}
          {showPaymentBlock && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-red-800 mb-4">
                  <AlertTriangle className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Payment Required to Create Batch</h3>
                </div>
                
                <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Batch Details:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Batch Name:</strong> {batchData.name}</p>
                      <p><strong>Subject:</strong> {batchData.subject}</p>
                      <p><strong>Max Students:</strong> {batchData.student_limit}</p>
                    </div>
                    <div>
                      <p><strong>Course Fees:</strong> ₹{batchData.fees || 0}</p>
                      <p><strong>Monthly Subscription:</strong> ₹{Math.max(
                        batchData.student_limit * 35,
                        (parseFloat(batchData.fees) || 0) * 0.07
                      )}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>💡 Like Netflix:</strong> You need to pay for this specific batch creation. 
                    This payment is only for creating this new batch, not for previous batches.
                  </p>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={handlePaymentForBatch}
                    disabled={isProcessingPayment}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessingPayment ? 'Processing...' : `Pay ₹${Math.max(
                      batchData.student_limit * 35,
                      (parseFloat(batchData.fees) || 0) * 0.07
                    )} to Create Batch`}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPaymentBlock(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div>
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
                onChange={(e) => setBatchData({...batchData, fees: e.target.value})} 
                placeholder="Enter course fees"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          
          {/* Subscription Information for New Batch */}
          {batchData.student_limit && batchData.fees && (
            <div className="mt-4">
              {showSubscriptionDetails({
                max_student_limit: batchData.student_limit,
                current_student_count: 0, // New batch starts with 0 students
                monthly_fee: Math.max(
                  batchData.student_limit * 35, // ₹35 per student minimum
                  (parseFloat(batchData.fees) || 0) * 0.07 // 7% of batch fees
                )
              })}
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
