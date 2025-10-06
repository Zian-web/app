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

  const payForMonth = async (paymentId) => {
    // Simple redirect to payment page with full API URL
    const paymentUrl = `${API_BASE_URL}${ENDPOINTS.PAYMENTS.STUDENT.PAYMENT_PAGE(batchId, 1)}`;
    window.location.href = paymentUrl;
  };

  const payMultipleMonths = async (months) => {
    // Simple redirect to payment page with full API URL
    const paymentUrl = `${API_BASE_URL}${ENDPOINTS.PAYMENTS.STUDENT.PAYMENT_PAGE(batchId, months)}`;
    window.location.href = paymentUrl;
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

            {/* Payments Table */}
            <div className="overflow-x-auto">
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
                          onClick={() => payForMonth(payment.id)}
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
