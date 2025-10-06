import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  CreditCard, 
  DollarSign, 
  History, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const StudentPaymentInterface = ({ batches = [], studentId }) => {
  const [activeTab, setActiveTab] = useState('payments');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { toast } = useToast();

  // Mock data - replace with actual API calls
  const mockPayments = [
    {
      id: 1,
      batch_id: 1,
      batch_name: 'Math Class A',
      amount: 500,
      payment_mode: 'online',
      payment_status: 'paid',
      payment_date: '2024-01-15',
      due_date: '2024-01-10',
      months_paid: 1,
      teacher_name: 'Dr. Smith',
      batch_fees: 500
    },
    {
      id: 2,
      batch_id: 1,
      batch_name: 'Math Class A',
      amount: 500,
      payment_mode: 'cash',
      payment_status: 'due',
      payment_date: null,
      due_date: '2024-02-10',
      months_paid: 1,
      teacher_name: 'Dr. Smith',
      batch_fees: 500
    },
    {
      id: 3,
      batch_id: 2,
      batch_name: 'Science Class B',
      amount: 750,
      payment_mode: 'online',
      payment_status: 'paid',
      payment_date: '2024-01-12',
      due_date: '2024-01-10',
      months_paid: 1,
      teacher_name: 'Prof. Johnson',
      batch_fees: 750
    }
  ];

  useEffect(() => {
    setPayments(mockPayments);
  }, []);

  // Calculate payment statistics
  const totalPaid = payments
    .filter(p => p.payment_status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalDue = payments
    .filter(p => p.payment_status === 'due')
    .reduce((sum, p) => sum + p.amount, 0);

  const paidCount = payments.filter(p => p.payment_status === 'paid').length;
  const dueCount = payments.filter(p => p.payment_status === 'due').length;

  // Get current month due fees
  const currentMonthDue = payments
    .filter(p => p.payment_status === 'due')
    .reduce((sum, p) => sum + p.amount, 0);

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.batch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        payment.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || payment.batch_id.toString() === selectedBatch;
    const matchesStatus = paymentFilter === 'all' || payment.payment_status === paymentFilter;
    
    return matchesSearch && matchesBatch && matchesStatus;
  });

  // Get batch-wise payment summary
  const batchPaymentSummary = batches.map(batch => {
    const batchPayments = payments.filter(p => p.batch_id === batch.id);
    const batchPaid = batchPayments
      .filter(p => p.payment_status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const batchDue = batchPayments
      .filter(p => p.payment_status === 'due')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      ...batch,
      paid_amount: batchPaid,
      due_amount: batchDue,
      total_payments: batchPayments.length,
      paid_payments: batchPayments.filter(p => p.payment_status === 'paid').length
    };
  });

  const handleMakePayment = async (paymentId) => {
    try {
      setIsLoading(true);
      // API call to initiate payment
      toast({
        title: "Payment Initiated",
        description: "Redirecting to payment gateway...",
        variant: "default"
      });
      // Simulate payment process
      setTimeout(() => {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully",
          variant: "default"
        });
        setIsLoading(false);
        setShowPaymentDialog(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleDownloadReceipt = async (paymentId) => {
    try {
      // API call to download receipt
      toast({
        title: "Receipt Downloaded",
        description: "Payment receipt has been downloaded",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download receipt",
        variant: "destructive"
      });
    }
  };

  const canMakePayment = (payment) => {
    return payment.payment_status === 'due' && payment.payment_mode === 'online';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Payment Management</h2>
          <p className="text-muted-foreground">Manage your course payments and view payment history</p>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {paidCount} payments completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalDue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {dueCount} payments pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Due</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{currentMonthDue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current month fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {paidCount + dueCount > 0 ? ((paidCount / (paidCount + dueCount)) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Payment completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">All Payments</TabsTrigger>
          <TabsTrigger value="batch-wise">Batch-wise</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>

        {/* All Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search batches or teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.map(batch => (
                  <SelectItem key={batch.id} value={batch.id.toString()}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="due">Due</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.batch_name}</TableCell>
                      <TableCell>{payment.teacher_name}</TableCell>
                      <TableCell>₹{payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.payment_mode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={payment.payment_status === 'paid' ? 'default' : 'destructive'}>
                          {payment.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.due_date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {canMakePayment(payment) && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowPaymentDialog(true);
                              }}
                              disabled={isLoading}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pay Now
                            </Button>
                          )}
                          {payment.payment_status === 'paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadReceipt(payment.id)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Receipt
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPayment(payment);
                              // Show payment details
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Batch-wise Tab */}
        <TabsContent value="batch-wise" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batchPaymentSummary.map(batch => (
              <Card key={batch.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{batch.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{batch.subject}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Paid:</span>
                    <span className="font-bold text-green-600">₹{batch.paid_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Due:</span>
                    <span className="font-bold text-red-600">₹{batch.due_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payments Made:</span>
                    <span className="font-bold text-blue-600">{batch.paid_payments}/{batch.total_payments}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Payment Rate:</span>
                      <span className="font-medium">
                        {batch.total_payments > 0 
                          ? ((batch.paid_payments / batch.total_payments) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                  </div>
                  {batch.due_amount > 0 && (
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        const duePayment = payments.find(p => p.batch_id === batch.id && p.payment_status === 'due');
                        if (duePayment) {
                          setSelectedPayment(duePayment);
                          setShowPaymentDialog(true);
                        }
                      }}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Due Amount
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Complete Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.payment_date || payment.due_date}</TableCell>
                      <TableCell>{payment.batch_name}</TableCell>
                      <TableCell>₹{payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.payment_mode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={payment.payment_status === 'paid' ? 'default' : 'destructive'}>
                          {payment.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.payment_status === 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReceipt(payment.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipts Tab */}
        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Payment Receipts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.filter(p => p.payment_status === 'paid').map(payment => (
                  <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.batch_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Paid on {payment.payment_date} • ₹{payment.amount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReceipt(payment.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Show receipt preview
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Batch:</span>
                  <span className="font-medium">{selectedPayment.batch_name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Teacher:</span>
                  <span className="font-medium">{selectedPayment.teacher_name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Amount:</span>
                  <span className="font-bold text-lg">₹{selectedPayment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Due Date:</span>
                  <span className="text-red-600">{selectedPayment.due_date}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select defaultValue="razorpay">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay (Online)</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleMakePayment(selectedPayment.id)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Pay Now'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentDialog(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPaymentInterface;
