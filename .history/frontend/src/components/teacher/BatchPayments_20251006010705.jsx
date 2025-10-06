import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

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
    try {
      setIsProcessingPayment(true);
      
      // Initiate online payment for student
      const response = await api.post('/api/payments/online/initiate', {
        batch_id: batchId,
        payment_id: payment.id,
        months: 1, // Default to 1 month, can be made configurable
        payment_mode: 'online'
      });
      
      toast({
        title: "Payment Initiated",
        description: "Payment link has been generated. Please complete the payment.",
      });
      
      // Refresh payments after successful initiation
      if (onUpdatePayment) {
        onUpdatePayment();
      }
    } catch (error) {
      console.error('Error initiating student payment:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to initiate payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Payment Records</h2>
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
                    {userRole === 'teacher' && <div className="font-medium text-sm">{getStudentName(payment.studentId)}</div>}
                    <Badge variant={payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'warning' : 'destructive'}>
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">${payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span>{payment.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid Date:</span>
                      <span>{payment.paidDate || 'N/A'}</span>
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
                  {userRole === 'student' && payment.status === 'pending' && teacherHasOnlinePayment && (
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
                  {userRole === 'student' && payment.status === 'pending' && !teacherHasOnlinePayment && (
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
                    {userRole === 'teacher' && <TableHead className="w-[20%]">Student</TableHead>}
                    <TableHead className="w-[15%]">Amount</TableHead>
                    <TableHead className="w-[20%]">Due Date</TableHead>
                    <TableHead className="w-[15%]">Status</TableHead>
                    <TableHead className="w-[20%]">Paid Date</TableHead>
                    <TableHead className="w-[10%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      {userRole === 'teacher' && <TableCell className="font-medium w-[20%]">{getStudentName(payment.studentId)}</TableCell>}
                      <TableCell className="w-[15%]">${payment.amount}</TableCell>
                      <TableCell className="w-[20%]">{payment.dueDate}</TableCell>
                      <TableCell className="w-[15%]">
                        <Badge variant={payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'warning' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[20%]">{payment.paidDate || 'N/A'}</TableCell>
                      <TableCell className="w-[10%]">
                        {userRole === 'teacher' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdatePayment(payment)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Update
                          </Button>
                        )}
                        {userRole === 'student' && payment.status === 'pending' && teacherHasOnlinePayment && (
                            <Button
                                size="sm"
                                onClick={() => handleStudentPayment(payment)}
                                disabled={isProcessingPayment}
                            >
                                {isProcessingPayment ? 'Processing...' : 'Pay Now'}
                            </Button>
                        )}
                        {userRole === 'student' && payment.status === 'pending' && !teacherHasOnlinePayment && (
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
