import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS, API_BASE_URL } from '../../config/endpoints';

const StudentDuePayments = ({ batchId, onPaymentUpdate }) => {
  const [duePayments, setDuePayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDuePayments();
  }, [batchId]);

  const fetchDuePayments = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.PAYMENTS.STUDENT.DUE_PAYMENTS(batchId));
      console.log('Due payments response:', response);
      setDuePayments(response.data || response);
    } catch (error) {
      console.error('Error fetching due payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch due payments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const payForMonth = async (paymentId, months = 1) => {
    try {
      setProcessingPayment(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make payments",
          variant: "destructive"
        });
        return;
      }
      
      const response = await api.post(ENDPOINTS.PAYMENTS.ONLINE.INITIATE, {
        batch_id: batchId,
        months: months,
        payment_mode: "online"
      });
      
      if (response.data?.url) {
        // Redirect to the payment page
        window.location.href = response.data.url;
      } else {
        toast({
          title: "Payment Error",
          description: "No payment URL received",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.detail === "Invalid token") {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        // Optionally redirect to login
        // window.location.href = '/login';
      } else {
        toast({
          title: "Payment Failed",
          description: error.response?.data?.detail || "Failed to initiate payment",
          variant: "destructive"
        });
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  const payMultipleMonths = async (months) => {
    try {
      setProcessingPayment(true);
      console.log('Pay All clicked - months:', months, 'batchId:', batchId);
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make payments",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Making API call for bulk payment...');
      const response = await api.post(ENDPOINTS.PAYMENTS.ONLINE.INITIATE, {
        batch_id: batchId,
        months: months,
        payment_mode: "online"
      });
      
      console.log('Bulk payment response:', response);
      
      if (response.data?.url) {
        console.log('Redirecting to payment URL:', response.data.url);
        // Redirect to the payment page
        window.location.href = response.data.url;
      } else {
        console.error('No payment URL received');
        toast({
          title: "Payment Error",
          description: "No payment URL received",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.detail === "Invalid token") {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        // Optionally redirect to login
        // window.location.href = '/login';
      } else {
        toast({
          title: "Payment Failed",
          description: error.response?.data?.detail || "Failed to initiate payment",
          variant: "destructive"
        });
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading due payments...</p>
        </div>
      </div>
    );
  }

  if (!duePayments || !duePayments.due_payments || duePayments.due_payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-600 mb-2">All Payments Up to Date</h3>
          <p className="text-gray-600">You have no outstanding payments for this batch.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Due</p>
                <p className="text-2xl font-bold text-red-600">₹{duePayments.total_due}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Months Due</p>
                <p className="text-2xl font-bold text-orange-600">{duePayments.months_due}</p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Fee</p>
                <p className="text-2xl font-bold text-blue-600">₹{duePayments.monthly_fee}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Due Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Due Payments ({duePayments.months_due} months)</CardTitle>
          <CardDescription>
            Outstanding payments for {duePayments.batch_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Pay All Button */}
            {duePayments.due_payments.length > 1 && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => payMultipleMonths(duePayments.months_due)}
                  disabled={processingPayment}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay All {duePayments.months_due} Months (₹{duePayments.total_due})
                </Button>
              </div>
            )}

            {/* Individual Month Cards - Always Visible */}
            <div className="space-y-3">
              {duePayments.due_payments.map((payment, index) => (
                <div key={payment.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-orange-800">Month {index + 1}</h4>
                      <p className="text-sm text-orange-600">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="destructive">Due</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-orange-800">₹{payment.amount}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => payForMonth(payment.id, 1)}
                      disabled={processingPayment}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payments Table - Desktop View (Hidden for now to avoid duplication) */}
            <div className="hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {duePayments.due_payments.map((payment, index) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        Month {index + 1}
                      </TableCell>
                      <TableCell>₹{payment.amount}</TableCell>
                      <TableCell>
                        {new Date(payment.due_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Due</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => payForMonth(payment.id, 1)}
                          disabled={processingPayment}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDuePayments;
