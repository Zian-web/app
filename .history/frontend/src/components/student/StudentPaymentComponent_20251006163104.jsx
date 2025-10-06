import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CreditCard, AlertTriangle, CheckCircle, User, Phone } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';
import PaymentButton from './PaymentButton';

const StudentPaymentComponent = ({ batchId, onPaymentUpdate }) => {
  const [paymentOptions, setPaymentOptions] = useState(null);
  const [duePayments, setDuePayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPaymentData();
  }, [batchId]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      // Load payment options and due payments in parallel
      const [optionsResponse, dueResponse] = await Promise.allSettled([
        api.get(ENDPOINTS.PAYMENTS.STUDENT.PAYMENT_OPTIONS(batchId)),
        api.get(ENDPOINTS.PAYMENTS.STUDENT.DUE_PAYMENTS(batchId))
      ]);
      
      // Handle payment options
      if (optionsResponse.status === 'fulfilled') {
        setPaymentOptions(optionsResponse.value.data || optionsResponse.value);
      }
      
      // Handle due payments
      if (dueResponse.status === 'fulfilled') {
        setDuePayments(dueResponse.value.data || dueResponse.value);
      }
      
    } catch (error) {
      console.error('Error loading payment data:', error);
      toast({
        title: "Error",
        description: "Failed to load payment data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = () => {
    loadPaymentData();
    if (onPaymentUpdate) onPaymentUpdate();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading payment options...</p>
        </div>
      </div>
    );
  }

  if (!paymentOptions) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-600 mb-2">No Payment Options Available</h3>
          <p className="text-gray-600">Unable to load payment information for this batch.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Batch Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment for {paymentOptions.batch_name}
          </CardTitle>
          <CardDescription>
            Monthly Fee: ₹{paymentOptions.monthly_fee} | Teacher: {paymentOptions.teacher_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentOptions.has_online_payment ? (
            <div className="space-y-4">
              {/* Online Payment Available */}
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">💳 Online Payment Available</span>
              </div>
              
              {/* Due Payments Section */}
              {duePayments && duePayments.months_due > 0 ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Outstanding Payments ({duePayments.months_due} months)
                  </h4>
                  <p className="text-orange-700 mb-3">
                    Total Due: ₹{duePayments.total_due}
                  </p>
                  
                  <div className="space-y-2">
                    {duePayments.due_payments.map((payment, index) => (
                      <div key={payment.id} className="flex justify-between items-center bg-white p-2 rounded border">
                        <span className="text-sm">
                          Month {index + 1}: ₹{payment.amount}
                        </span>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(payment.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">All payments up to date!</span>
                  </div>
                </div>
              )}
              
              {/* Payment Buttons */}
              <div className="flex flex-wrap gap-3">
                <PaymentButton 
                  batchId={batchId} 
                  months={1}
                  className="bg-blue-600 hover:bg-blue-700"
                />
                {duePayments && duePayments.months_due > 1 && (
                  <PaymentButton 
                    batchId={batchId} 
                    months={duePayments.months_due}
                    className="bg-green-600 hover:bg-green-700"
                  />
                )}
                {duePayments && duePayments.months_due > 1 && (
                  <Button 
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    Pay All {duePayments.months_due} Months (₹{duePayments.total_due})
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Offline Payment Only */}
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">⚠️ Online Payment Not Available</span>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-700 mb-2">
                  Please contact your teacher for payment instructions.
                </p>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <User className="h-4 w-4" />
                  <span>Teacher: {paymentOptions.teacher_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600 mt-1">
                  <Phone className="h-4 w-4" />
                  <span>Monthly Fee: ₹{paymentOptions.monthly_fee}</span>
                </div>
              </div>
              
              <Button 
                variant="outline"
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
              >
                Contact Teacher
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPaymentComponent;
