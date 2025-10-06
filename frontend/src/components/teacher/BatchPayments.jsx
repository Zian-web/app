import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS, API_BASE_URL } from '../../config/endpoints';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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
    console.log('BatchPayments - Payment filter:', paymentFilter);
    if (payments.length > 0) {
      console.log('BatchPayments - First payment structure:', payments[0]);
    }
    
    // Filter payments based on paymentFilter
    let filteredPayments = payments;
    if (paymentFilter && paymentFilter !== 'all') {
      filteredPayments = payments.filter(payment => {
        const status = payment.payment_status || payment.status;
        switch (paymentFilter) {
          case 'paid':
            return status === 'paid';
          case 'pending':
            return status === 'pending';
          case 'overdue':
            return status === 'overdue' || status === 'due';
          default:
            return true;
        }
      });
    }
    
    console.log('BatchPayments - Filtered payments:', filteredPayments.length);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newPayments = filteredPayments.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
      setDisplayedPayments(newPayments);
    } else {
      setDisplayedPayments(prev => [...prev, ...newPayments]);
    }
    setIsLoading(false);
  }, [currentPage, payments, paymentFilter]);

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
      
      // NEW - Use the correct POST endpoint
      const response = await fetch(`${API_BASE_URL}/api/payments/online/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          batch_id: batchId,
          months: 1,
          payment_mode: "online"
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Payment response:', data);
        // Redirect to Razorpay payment link
        window.location.href = data.payment_link_url;
      } else {
        const error = await response.json();
        console.error('Payment error:', error);
        toast({
          title: "Payment Error",
          description: error.detail || "Failed to initiate payment",
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
      setIsProcessingPayment(false);
    }
  };

  const markCashPayment = async (paymentId) => {
    try {
      console.log('Marking cash payment for ID:', paymentId);
      
      const response = await api.put(ENDPOINTS.PAYMENTS.CASH.MARK_ALT(paymentId), {
        payment_mode: 'cash',
        status: 'paid'
      });
      console.log('Cash payment response:', response);
      
      toast({
        title: "Success",
        description: "Cash payment marked successfully",
      });
      
      if (onUpdatePayment) {
        onUpdatePayment();
      }
    } catch (error) {
      console.error('Error marking cash payment:', error);
      toast({
        title: "Error",
        description: `Failed to mark cash payment: ${error.response?.data?.detail || error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleMarkAsDue = async (paymentId) => {
    try {
      await api.put(`/api/payments/${paymentId}/mark-pending`);
      toast({
        title: "Success",
        description: "Payment marked as due.",
      });
      if (onUpdatePayment) {
        onUpdatePayment();
      }
    } catch (error) {
      console.error("Error marking payment as due:", error);
      toast({
        title: "Error",
        description: "Failed to mark payment as due.",
        variant: "destructive",
      });
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

      <Card>
        <CardContent className="p-0">
          {/* Mobile View - Card Layout */}
          <div className="block md:hidden">
            {/* ... similar implementation for mobile ... */}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => markCashPayment(payment.id)}>
                                Mark as cash
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMarkAsDue(payment.id)}>
                                Mark as due
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={userRole === 'teacher' ? 9 : 8} className="text-center py-4">
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
