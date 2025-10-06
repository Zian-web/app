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
    let filteredPayments = payments;

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
      const response = await api.get('/api/student/payments/summary');
      setPaymentSummary(response.data);
    } catch (error) {
      console.error('Error fetching payment summary:', error);
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
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedPayments.length < payments.length) {
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

  const getBatchPaymentStatus = async (batchId) => {
    try {
      const response = await api.get(`/api/student/batch/${batchId}/payment-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching batch payment status:', error);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Make Payment (Demo)</span>
            </CardTitle>
            <CardDescription>This is a demo feature. No actual payment will be processed.</CardDescription>
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
               Make Demo Payment
             </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Payment Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between"><span>Total Payments:</span><span className="font-medium">{validPayments.length}</span></div>
              <div className="flex justify-between"><span>Paid Amount:</span><span className="font-medium text-green-600">${paidAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Pending Amount:</span><span className="font-medium text-red-600">${pendingAmount.toFixed(2)}</span></div>
            </div>
          </CardContent>
        </Card>
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{formatDate(payment.due_date)}</TableCell>
                     <TableCell>
                       <Badge variant={payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'warning' : 'destructive'}>
                         {payment.status}
                       </Badge>
                     </TableCell>
                    <TableCell>{payment.status === 'paid' ? formatDate(payment.updated_at) : 'N/A'}</TableCell>
                  </TableRow>
                ))}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
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