import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CreditCard, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import api from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';

const TeacherDuePayments = ({ batchId, onPaymentUpdate }) => {
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
      const response = await api.get(ENDPOINTS.PAYMENTS.TEACHER.BATCH_DUE(batchId));
      console.log('Teacher due payments response:', response);
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

  const markCashPayment = async (paymentId) => {
    try {
      setProcessingPayment(true);
      await api.post(ENDPOINTS.PAYMENTS.CASH.MARK, {
        id: paymentId,
        status: 'paid',
        payment_mode: 'cash'
      });
      
      toast({
        title: "Payment Marked",
        description: "Payment marked as cash successfully",
      });
      
      // Refresh due payments
      await fetchDuePayments();
      if (onPaymentUpdate) onPaymentUpdate();
      
    } catch (error) {
      console.error('Error marking cash payment:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to mark payment as cash",
        variant: "destructive"
      });
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
          <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-600 mb-2">All Payments Collected</h3>
          <p className="text-gray-600">No outstanding payments for this batch.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
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
                <p className="text-sm font-medium text-muted-foreground">Students with Dues</p>
                <p className="text-2xl font-bold text-orange-600">{duePayments.total_students_with_dues}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold text-blue-600">{duePayments.summary?.collection_rate || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{duePayments.summary?.paid_amount || 0}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students with Due Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Students with Outstanding Payments</CardTitle>
          <CardDescription>
            Manage payments for students with outstanding dues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {duePayments.due_payments.map((student) => (
              <StudentDueCard 
                key={student.student_id} 
                student={student} 
                onMarkCash={markCashPayment}
                processingPayment={processingPayment}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StudentDueCard = ({ student, onMarkCash, processingPayment }) => {
  return (
    <Card className="border-l-4 border-l-red-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{student.student_name}</h4>
            <p className="text-sm text-gray-600">Student ID: {student.student_id}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Outstanding:</span> ₹{student.outstanding_amount}
              </p>
              <p className="text-sm">
                <span className="font-medium">Months Due:</span> {student.months_due}
              </p>
              <p className="text-sm">
                <span className="font-medium">Last Payment:</span> {student.last_payment_date || 'Never'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Badge variant="destructive" className="w-fit">
              {student.months_due} months due
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMarkCash(student.student_id)}
              disabled={processingPayment}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Mark Cash
            </Button>
          </div>
        </div>
        
        {/* Individual Payment Records */}
        {student.payment_records && student.payment_records.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h5 className="font-medium text-sm mb-2">Payment History:</h5>
            <div className="space-y-2">
              {student.payment_records.map((payment, index) => (
                <div key={payment.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <span>Month {index + 1}</span>
                  <span>₹{payment.amount}</span>
                  <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'}>
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherDuePayments;
