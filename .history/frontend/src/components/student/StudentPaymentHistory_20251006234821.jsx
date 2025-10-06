import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CreditCard, Calendar, CheckCircle } from 'lucide-react';

const StudentPaymentHistory = ({ payments, userRole, getStudentName, getPaymentStatusColor, onUpdatePayment, batchId, teacherHasOnlinePayment }) => {
  const [displayedPayments, setDisplayedPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  // Filter to only show PAID payments
  const paidPayments = useMemo(() => {
    return payments.filter(payment => {
      const status = payment.payment_status || payment.status;
      return status === 'paid';
    });
  }, [payments]);

  useEffect(() => {
    setIsLoading(true);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newPayments = paidPayments.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
      setDisplayedPayments(newPayments);
    } else {
      setDisplayedPayments(prev => [...prev, ...newPayments]);
    }
    setIsLoading(false);
  }, [currentPage, paidPayments]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedPayments.length < paidPayments.length) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  if (paidPayments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your payment records for this batch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment History</h3>
            <p className="text-gray-600">You haven't made any payments yet. Use the payment options above to make your first payment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Your completed payments for this batch</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Months</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.batch_name || payment.batchName || 'N/A'}
                    </TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell>
                      {payment.months_paid || payment.monthsPaid || (payment.amount / (payment.batch_fees || 500)) || 1}
                    </TableCell>
                    <TableCell>
                      {payment.paid_date ? new Date(payment.paid_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={payment.payment_mode === 'online' ? 'default' : 'secondary'}>
                        {payment.payment_mode || 'online'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {displayedPayments.map((payment) => (
              <div key={payment.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-green-800">
                      {payment.batch_name || payment.batchName || 'N/A'}
                    </h4>
                    <p className="text-sm text-green-600">
                      {payment.paid_date ? new Date(payment.paid_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Paid
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-green-800">₹{payment.amount}</p>
                    <p className="text-sm text-green-600">
                      {payment.months_paid || payment.monthsPaid || (payment.amount / (payment.batch_fees || 500)) || 1} months
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={payment.payment_mode === 'online' ? 'default' : 'secondary'}>
                      {payment.payment_mode || 'online'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {displayedPayments.length < paidPayments.length && (
            <div className="text-center">
              <Button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentPaymentHistory;
