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

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Payment Summary Cards */}
      {paymentSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">₹{paymentSummary.total_paid || 0}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Due</p>
                  <p className="text-2xl font-bold text-red-600">₹{paymentSummary.total_due || 0}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Online Payments</p>
                  <p className="text-2xl font-bold text-blue-600">{paymentSummary.online_payments || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cash Payments</p>
                  <p className="text-2xl font-bold text-purple-600">{paymentSummary.cash_payments || 0}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <input
            type="text"
            placeholder="Search student or batch..."
            value={paymentSearch}
            onChange={(e) => setPaymentSearch(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          />
          <div className="flex items-center justify-between gap-2">
            <Button className="flex-1 md:flex-initial" variant={paymentFilter === 'all' ? 'default' : 'outline'} onClick={() => setPaymentFilter('all')}>All</Button>
            <Button className="flex-1 md:flex-initial" variant={paymentFilter === 'paid' ? 'default' : 'outline'} onClick={() => setPaymentFilter('paid')}>Paid</Button>
            <Button className="flex-1 md:flex-initial" variant={paymentFilter === 'pending' ? 'default' : 'outline'} onClick={() => setPaymentFilter('pending')}>Due</Button>
          </div>
          <Button variant="destructive" onClick={sendPaymentReminders} className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>Send Reminders</span>
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
                  <TableHead className="w-[15%]">Months</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[10%]">Mode</TableHead>
                  <TableHead className="w-[10%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="w-[20%]">{payment.student_name}</TableCell>
                    <TableCell className="w-[15%]">{payment.batch_name}</TableCell>
                    <TableCell className="w-[15%]">₹{payment.amount}</TableCell>
                    <TableCell className="w-[15%]">{payment.months_paid}</TableCell>
                    <TableCell className="w-[15%]">
                      <Badge variant={payment.payment_status === 'paid' ? 'default' : 'destructive'}>
                        {payment.payment_status === 'paid' ? 'Paid' : 'Due'}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[10%]">
                      <Badge variant={payment.payment_mode === 'online' ? 'default' : 'secondary'}>
                        {payment.payment_mode}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[10%]">
                      {payment.payment_status === 'due' && payment.payment_mode === 'cash' && (
                        <Button 
                          size="sm" 
                          onClick={() => markCashPayment(payment.id)}
                          className="text-xs"
                        >
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
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
