import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Bell, DollarSign, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import PaymentSummary from '../shared/PaymentSummary';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const TeacherPayments = () => {
  const [payments, setPayments] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [displayedPayments, setDisplayedPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Fetch payments and summary data
  useEffect(() => {
    fetchPayments();
    fetchPaymentSummary();
  }, []);

  // Filter and paginate payments
  useEffect(() => {
    let filteredPayments = payments;

    // Apply search filter
    if (paymentSearch) {
      filteredPayments = filteredPayments.filter(payment => 
        payment.student_name?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
        payment.batch_name?.toLowerCase().includes(paymentSearch.toLowerCase())
      );
    }

    // Apply status filter
    if (paymentFilter !== 'all') {
      filteredPayments = filteredPayments.filter(payment => {
        if (paymentFilter === 'paid') return payment.payment_status === 'paid';
        if (paymentFilter === 'pending') return payment.payment_status === 'due';
        return true;
      });
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newPayments = filteredPayments.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
      setDisplayedPayments(newPayments);
    } else {
      setDisplayedPayments(prev => [...prev, ...newPayments]);
    }
    setIsLoading(false);
  }, [currentPage, payments, paymentFilter, paymentSearch]);

  const fetchPayments = async () => {
    try {
      setIsLoadingData(true);
      const response = await api.get('/api/teacher/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchPaymentSummary = async () => {
    try {
      const response = await api.get('/api/teacher/payments/summary');
      setPaymentSummary(response.data);
    } catch (error) {
      console.error('Error fetching payment summary:', error);
    }
  };

  const sendPaymentReminders = async () => {
    try {
      await api.post('/api/payments/reminders/send');
      toast({
        title: "Success",
        description: "Payment reminders sent successfully",
      });
    } catch (error) {
      console.error('Error sending reminders:', error);
      toast({
        title: "Error",
        description: "Failed to send payment reminders",
        variant: "destructive"
      });
    }
  };

  const markCashPayment = async (paymentId) => {
    try {
      await api.post('/api/payments/cash', {
        payment_id: paymentId,
        payment_mode: 'cash',
        payment_status: 'paid'
      });
      toast({
        title: "Success",
        description: "Cash payment marked successfully",
      });
      fetchPayments(); // Refresh data
    } catch (error) {
      console.error('Error marking cash payment:', error);
      toast({
        title: "Error",
        description: "Failed to mark cash payment",
        variant: "destructive"
      });
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedPayments.length < payments.length) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Overall Payment</h2>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <input
            type="text"
            placeholder="Search student or batch..."
            value={paymentSearch}
            onChange={onSearchChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          />
          <div className="flex items-center justify-between gap-2">
            <Button className="flex-1 md:flex-initial" variant={paymentFilter === 'all' ? 'default' : 'outline'} onClick={() => onFilterChange('all')}>All</Button>
            <Button className="flex-1 md:flex-initial" variant={paymentFilter === 'paid' ? 'default' : 'outline'} onClick={() => onFilterChange('paid')}>Paid</Button>
            <Button className="flex-1 md:flex-initial" variant={paymentFilter === 'pending' ? 'default' : 'outline'} onClick={() => onFilterChange('pending')}>Due</Button>
          </div>
           <Button variant="destructive" onClick={onAlertPending} className="flex items-center gap-2">
             <Bell className="w-4 h-4" />
             <span>Alert All Due</span>
           </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div 
            className="overflow-x-auto h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
            onScroll={handleScroll}
          >
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Student</TableHead>
                  <TableHead className="w-[15%]">Batch</TableHead>
                  <TableHead className="w-[15%]">Amount</TableHead>
                  <TableHead className="w-[20%]">Due Date</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]">Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="w-[20%]">{getStudentName(payment.studentId)}</TableCell>
                    <TableCell className="w-[15%]">{getBatchName(payment.batchId)}</TableCell>
                    <TableCell className="w-[15%]">${payment.amount}</TableCell>
                    <TableCell className="w-[20%]">{payment.dueDate}</TableCell>
                    <TableCell className="w-[15%]">
                      <Badge variant={payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'warning' : 'destructive'}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[15%]">{payment.paidDate || 'N/A'}</TableCell>
                  </TableRow>
                ))}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading more payments...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherPayments;
