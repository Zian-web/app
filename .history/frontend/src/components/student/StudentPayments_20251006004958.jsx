import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DollarSign, History, CreditCard, Banknote } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [displayedPayments, setDisplayedPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [selectedBatchForPayment, setSelectedBatchForPayment] = useState('');
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    fetchPayments();
    fetchPaymentSummary();
    fetchBatches();
  }, []);

  // Filter and paginate payments
  useEffect(() => {
    let filteredPayments = payments || [];

    // Apply batch filter
    if (selectedBatch !== 'all') {
      filteredPayments = filteredPayments.filter(payment => 
        payment.batch_id === parseInt(selectedBatch)
      );
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
  }, [currentPage, payments, selectedBatch]);

  const fetchPayments = async () => {
    try {
      setIsLoadingData(true);
      const response = await api.get('/api/student/payments');
      console.log('Student payments response:', response.data); // Debug log
      setPayments(response.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive"
      });
      setPayments([]); // Set empty array on error
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchPaymentSummary = async () => {
    try {
      const response = await api.get('/api/student/payments/summary');
      console.log('Student payment summary response:', response.data); // Debug log
      setPaymentSummary(response.data);
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      setPaymentSummary(null); // Set null on error
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await api.get('/api/student/batches/');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedPayments.length < (payments?.length || 0)) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleInitiatePayment = async () => {
    if (!selectedBatchForPayment) {
      toast({
        title: "Error",
        description: "Please select a batch",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await api.post('/api/payments/online/initiate', {
        batch_id: parseInt(selectedBatchForPayment),
        months: selectedMonths,
        payment_mode: 'online'
      });
      
      toast({
        title: "Payment Initiated",
        description: "Payment has been initiated. Please complete the payment process.",
      });
      
      // Refresh payments
      fetchPayments();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive"
      });
    }
  };

  const createTestPayments = async () => {
    try {
      // Create test payments for student
      const testPayments = [
        {
          batch_id: batches[0]?.id || 1,
          amount: 1000,
          months: 1,
          due_date: new Date().toISOString(),
          status: 'pending',
          payment_mode: 'online'
        },
        {
          batch_id: batches[1]?.id || 2,
          amount: 2000,
          months: 2,
          due_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          status: 'overdue',
          payment_mode: 'cash'
        }
      ];

      for (const payment of testPayments) {
        try {
          await api.post('/api/payments/create', payment);
        } catch (error) {
          console.log('Test payment creation failed (expected if endpoint not implemented):', error);
        }
      }

      toast({ title: "Test Payments", description: "Test payments created for student." });
      
      // Refresh payments
      fetchPayments();
    } catch (error) {
      console.error('Error creating test payments:', error);
    }
  };

  const getBatchPaymentStatus = async (batchId) => {
    try {
      const response = await api.get(`/api/student/batch/${batchId}/payment-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching batch payment status:', error);
      return null;
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Management</h2>

      {/* Payment Summary Cards */}
      {paymentSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <History className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-orange-600">{paymentSummary.pending_payments || 0}</p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Make Online Payment</span>
            </CardTitle>
            <CardDescription>Pay for your batch fees online</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="batch">Select Batch</Label>
              <Select value={selectedBatchForPayment} onValueChange={setSelectedBatchForPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {(batches || []).map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.name} - ₹{batch.fees}/month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="months">Months to Pay (1-6)</Label>
              <Select value={selectedMonths.toString()} onValueChange={(value) => setSelectedMonths(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {month} month{month > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleInitiatePayment} className="w-full" disabled={!selectedBatchForPayment}>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Online
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Banknote className="w-5 h-5" />
              <span>Payment Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Payments:</span>
                <span className="font-medium">{payments?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid Amount:</span>
                <span className="font-medium text-green-600">₹{paymentSummary?.total_paid || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Due Amount:</span>
                <span className="font-medium text-red-600">₹{paymentSummary?.total_due || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Online Payments:</span>
                <span className="font-medium text-blue-600">{paymentSummary?.online_payments || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Cash Payments:</span>
                <span className="font-medium text-purple-600">{paymentSummary?.cash_payments || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Filter */}
      <div className="flex items-center gap-4">
        <Label htmlFor="batch-filter">Filter by Batch:</Label>
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All batches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {(batches || []).map((batch) => (
              <SelectItem key={batch.id} value={batch.id.toString()}>
                {batch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={createTestPayments} variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100">
          Create Test Payments
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div 
            className="overflow-x-auto h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
            onScroll={handleScroll}
          >
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Months</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.batch_name || 'N/A'}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell>{payment.months_paid}</TableCell>
                    <TableCell>
                      <Badge variant={payment.payment_mode === 'online' ? 'default' : 'secondary'}>
                        {payment.payment_mode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={payment.payment_status === 'paid' ? 'default' : 'destructive'}>
                        {payment.payment_status === 'paid' ? 'Paid' : 'Due'}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.payment_date ? formatDate(payment.payment_date) : 'N/A'}</TableCell>
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

export default StudentPayments;