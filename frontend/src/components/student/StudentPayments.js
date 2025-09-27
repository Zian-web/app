import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { DollarSign, History } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const StudentPayments = ({ payments, getPaymentStatusColor }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const { toast } = useToast();

  const handleMakePayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Payment Successful",
      description: `Payment of $${paymentAmount} processed successfully (Demo)`,
      variant: "default"
    });
    setPaymentAmount('');
  };

  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Management</h2>

      {/* Payment Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Make Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Make Payment</span>
            </CardTitle>
            <CardDescription>Make a payment for this batch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Payment Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
            </div>
            <Button onClick={handleMakePayment} className="w-full" disabled={!paymentAmount}>
              <DollarSign className="w-4 h-4 mr-2" />
              Make Payment
            </Button>
            <p className="text-sm text-slate-600">Note: This is a demo. No actual payment will be processed.</p>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Payment Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between"><span>Total Payments:</span><span className="font-medium">{payments.length}</span></div>
              <div className="flex justify-between"><span>Paid Amount:</span><span className="font-medium text-green-600">${paidAmount}</span></div>
              <div className="flex justify-between"><span>Pending Amount:</span><span className="font-medium text-red-600">${pendingAmount}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell><Badge className={getPaymentStatusColor(payment.status)}>{payment.status}</Badge></TableCell>
                    <TableCell>{payment.paidDate || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPayments;