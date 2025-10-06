import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';

const BatchPayments = ({ 
  payments, 
  userRole, 
  getStudentName, 
  getPaymentStatusColor, 
  onUpdatePayment,
  paymentFilter,
  onFilterChange,
  paymentSearch,
  onSearchChange,
  batchId,
  teacherHasOnlinePayment = true
}) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);
  const [displayedPayments, setDisplayedPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    // Debug logging for payment data
    console.log('BatchPayments - All payments:', payments);
    console.log('BatchPayments - Payments length:', payments.length);
    if (payments.length > 0) {
      console.log('BatchPayments - First payment structure:', payments[0]);
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newPayments = payments.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
      setDisplayedPayments(newPayments);
    } else {
      setDisplayedPayments(prev => [...prev, ...newPayments]);
    }
    setIsLoading(false);
  }, [currentPage, payments]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedPayments.length < payments.length) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleUpdatePayment = (payment) => {
    setSelectedPayment(payment);
    setShowUpdatePayment(true);
    onUpdatePayment(payment);
  };

  const handleStudentPayment = async (payment) => {
    // Simple redirect to payment page
    window.location.href = ENDPOINTS.PAYMENTS.STUDENT.PAYMENT_PAGE(batchId, 1);
  };

  const markCashPayment = async (paymentId) => {
    try {
      console.log('Marking cash payment for ID:', paymentId);
      
      // Try different API endpoint structures
      const response = await api.post(ENDPOINTS.PAYMENTS.CASH.MARK, {
        id: paymentId,
        status: 'paid',
        payment_mode: 'cash'
      });
      
      console.log('Cash payment response:', response);
      
      toast({
        title: "Success",
        description: "Cash payment marked successfully",
      });
      
      // Refresh payments after successful marking
      if (onUpdatePayment) {
        onUpdatePayment();
      }
    } catch (error) {
      console.error('Error marking cash payment:', error);
      console.error('Error details:', error.response?.data);
      
      // Try alternative API call structure
      try {
        console.log('Trying alternative API structure...');
        const altResponse = await api.put(ENDPOINTS.PAYMENTS.CASH.MARK_ALT(paymentId), {
          payment_mode: 'cash',
          status: 'paid'
        });
        console.log('Alternative response:', altResponse);
        
        toast({
          title: "Success",
          description: "Cash payment marked successfully",
        });
        
        // Refresh payments after successful marking
        if (onUpdatePayment) {
          onUpdatePayment();
        }
      } catch (altError) {
        console.error('Alternative API also failed:', altError);
        toast({
          title: "Error",
          description: `Failed to mark cash payment: ${altError.response?.data?.detail || altError.message}`,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Payment Records</h2>
          <div className="text-sm text-muted-foreground">
            Showing all monthly payments for this batch
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          {userRole === 'teacher' && (
            <input
              type="text"
              placeholder="Search student..."
              value={paymentSearch}
              onChange={onSearchChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <Button variant={paymentFilter === 'all' ? 'default' : 'outline'} onClick={() => onFilterChange('all')} className="whitespace-nowrap">All</Button>
            <Button variant={paymentFilter === 'paid' ? 'default' : 'outline'} onClick={() => onFilterChange('paid')} className="whitespace-nowrap">Paid</Button>
            <Button variant={paymentFilter === 'pending' ? 'default' : 'outline'} onClick={() => onFilterChange('pending')} className="whitespace-nowrap">Pending</Button>
            <Button variant={paymentFilter === 'overdue' ? 'default' : 'outline'} onClick={() => onFilterChange('overdue')} className="whitespace-nowrap">Overdue</Button>
          </div>
        </div>
      </div>

      {/* This is where the update payment UI was, it's now handled in BatchDetails */}

      <Card>
        <CardContent className="p-0">
          {/* Mobile View - Card Layout */}
          <div className="block md:hidden">
            <div 
              className="overflow-y-auto h-[75vh] min-h-[400px] p-4 space-y-4"
              onScroll={handleScroll}
            >
              {displayedPayments.map((payment) => (
                <div key={payment.id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start mb-2">
                    {userRole === 'teacher' && <div className="font-medium text-sm">{payment.student_name || getStudentName(payment.student_id || payment.studentId)}</div>}
                    <Badge variant={payment.payment_status === 'paid' || payment.status === 'paid' ? 'success' : payment.payment_status === 'pending' || payment.status === 'pending' ? 'warning' : 'destructive'}>
                      {payment.payment_status || payment.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">₹{payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Months:</span>
                      <span className="font-medium">{payment.months_paid || payment.monthsPaid || (payment.amount / (payment.batch_fees || 500)) || 1} month(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span>{payment.due_date || payment.dueDate || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid Date:</span>
                      <span>{payment.paid_date || payment.paidDate || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Mode:</span>
                      <span className="capitalize">{payment.payment_mode || payment.paymentMode || 'Online'}</span>
                    </div>
                  </div>
                  {userRole === 'teacher' && (
                    <div className="mt-3 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdatePayment(payment)}
                        className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Update
                      </Button>
                    </div>
                  )}
                  {userRole === 'student' && (payment.payment_status === 'due' || payment.status === 'due' || payment.payment_status === 'pending' || payment.status === 'pending') && teacherHasOnlinePayment && (
                    <div className="mt-3 pt-3 border-t">
                        <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleStudentPayment(payment)}
                            disabled={isProcessingPayment}
                        >
                            {isProcessingPayment ? 'Processing...' : 'Pay Now'}
                        </Button>
                    </div>
                  )}
                  {userRole === 'student' && (payment.payment_status === 'due' || payment.status === 'due' || payment.payment_status === 'pending' || payment.status === 'pending') && !teacherHasOnlinePayment && (
                    <div className="mt-3 pt-3 border-t">
                        <div className="text-center text-orange-600 text-sm">
                          <p className="font-medium">Contact Teacher for Payment</p>
                          <p className="text-xs">Online payment not available</p>
                        </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="text-center py-4">
                  Loading more payments...
                </div>
              )}
            </div>
          </div>

          {/* Desktop View - Table Layout */}
          <div className="hidden md:block">
            <div 
              className="overflow-x-auto h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
              onScroll={handleScroll}
            >
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    {userRole === 'teacher' && <TableHead className="w-[12%]">Student</TableHead>}
                    <TableHead className="w-[10%]">Batch</TableHead>
                    <TableHead className="w-[8%]">Amount</TableHead>
                    <TableHead className="w-[8%]">Months</TableHead>
                    <TableHead className="w-[12%]">Due Date</TableHead>
                    <TableHead className="w-[8%]">Status</TableHead>
                    <TableHead className="w-[12%]">Paid Date</TableHead>
                    <TableHead className="w-[8%]">Mode</TableHead>
                    <TableHead className="w-[12%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      {userRole === 'teacher' && <TableCell className="font-medium w-[12%]">{payment.student_name || getStudentName(payment.student_id || payment.studentId)}</TableCell>}
                      <TableCell className="w-[10%]">{payment.batch_name || payment.batchName || 'N/A'}</TableCell>
                      <TableCell className="w-[8%]">₹{payment.amount}</TableCell>
                      <TableCell className="w-[8%]">{payment.months_paid || payment.monthsPaid || (payment.amount / (payment.batch_fees || 500)) || 1}</TableCell>
                      <TableCell className="w-[12%]">{payment.due_date || payment.dueDate}</TableCell>
                      <TableCell className="w-[8%]">
                        <Badge variant={payment.payment_status === 'paid' || payment.status === 'paid' ? 'success' : payment.payment_status === 'pending' || payment.status === 'pending' ? 'warning' : 'destructive'}>
                          {payment.payment_status || payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[12%]">{payment.paid_date || payment.paidDate || 'N/A'}</TableCell>
                      <TableCell className="w-[8%]">{payment.payment_mode || payment.paymentMode || 'Online'}</TableCell>
                      <TableCell className="w-[12%]">
                        {userRole === 'teacher' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdatePayment(payment)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              Update
                            </Button>
                            {(payment.payment_status === 'due' || payment.status === 'due' || payment.payment_status === 'pending' || payment.status === 'pending') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markCashPayment(payment.id)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                Mark Cash
                              </Button>
                            )}
                          </div>
                        )}
                        {userRole === 'student' && (payment.payment_status === 'due' || payment.status === 'due' || payment.payment_status === 'pending' || payment.status === 'pending') && teacherHasOnlinePayment && (
                            <Button
                                size="sm"
                                onClick={() => handleStudentPayment(payment)}
                                disabled={isProcessingPayment || payment.payment_status === 'pending'}
                                variant={payment.payment_status === 'pending' ? 'outline' : 'default'}
                            >
                                {isProcessingPayment ? 'Processing...' : 
                                 payment.payment_status === 'pending' ? 'Payment Pending' : 'Pay Now'}
                            </Button>
                        )}
                        {userRole === 'student' && (payment.payment_status === 'due' || payment.status === 'due' || payment.payment_status === 'pending' || payment.status === 'pending') && !teacherHasOnlinePayment && (
                            <div className="text-center text-orange-600 text-sm">
                              <p className="font-medium">Contact Teacher</p>
                              <p className="text-xs">Online payment not available</p>
                            </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={userRole === 'teacher' ? 6 : 5} className="text-center py-4">
                        Loading more payments...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchPayments;
