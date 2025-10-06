import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  DollarSign, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  Bell,
  TrendingUp,
  Calendar,
  CreditCard,
  FileText,
  BarChart3
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const TeacherPaymentDashboard = ({ batches = [], students = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data - replace with actual API calls
  const mockPayments = [
    {
      id: 1,
      student_id: 1,
      student_name: 'John Doe',
      batch_id: 1,
      batch_name: 'Math Class A',
      amount: 500,
      payment_mode: 'online',
      payment_status: 'paid',
      payment_date: '2024-01-15',
      due_date: '2024-01-10',
      months_paid: 1
    },
    {
      id: 2,
      student_id: 2,
      student_name: 'Jane Smith',
      batch_id: 1,
      batch_name: 'Math Class A',
      amount: 500,
      payment_mode: 'cash',
      payment_status: 'due',
      payment_date: null,
      due_date: '2024-01-10',
      months_paid: 1
    },
    {
      id: 3,
      student_id: 3,
      student_name: 'Bob Johnson',
      batch_id: 2,
      batch_name: 'Science Class B',
      amount: 750,
      payment_mode: 'online',
      payment_status: 'paid',
      payment_date: '2024-01-12',
      due_date: '2024-01-10',
      months_paid: 1
    }
  ];

  useEffect(() => {
    setPayments(mockPayments);
  }, []);

  // Calculate payment statistics
  const totalRevenue = payments
    .filter(p => p.payment_status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalDue = payments
    .filter(p => p.payment_status === 'due')
    .reduce((sum, p) => sum + p.amount, 0);

  const paidCount = payments.filter(p => p.payment_status === 'paid').length;
  const dueCount = payments.filter(p => p.payment_status === 'due').length;

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        payment.batch_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || payment.batch_id.toString() === selectedBatch;
    const matchesStatus = paymentFilter === 'all' || payment.payment_status === paymentFilter;
    
    return matchesSearch && matchesBatch && matchesStatus;
  });

  // Get batch-wise payment statistics
  const batchStats = batches.map(batch => {
    const batchPayments = payments.filter(p => p.batch_id === batch.id);
    const batchRevenue = batchPayments
      .filter(p => p.payment_status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const batchDue = batchPayments
      .filter(p => p.payment_status === 'due')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      ...batch,
      revenue: batchRevenue,
      due: batchDue,
      paid_students: batchPayments.filter(p => p.payment_status === 'paid').length,
      due_students: batchPayments.filter(p => p.payment_status === 'due').length
    };
  });

  // Get students with overdue payments (last 3 months)
  const overdueStudents = students.filter(student => {
    const studentPayments = payments.filter(p => p.student_id === student.id);
    const overdueCount = studentPayments.filter(p => p.payment_status === 'due').length;
    return overdueCount > 0;
  });

  const handleMarkPayment = async (paymentId, status) => {
    try {
      setIsLoading(true);
      // API call to mark payment
      toast({
        title: "Success",
        description: `Payment marked as ${status}`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReminder = async (studentId) => {
    try {
      setIsLoading(true);
      // API call to send reminder
      toast({
        title: "Reminder Sent",
        description: "Payment reminder sent to student",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertAllDue = async () => {
    try {
      setIsLoading(true);
      // API call to send alerts to all due students
      toast({
        title: "Alerts Sent",
        description: "Payment reminders sent to all due students",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send alerts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Payment Dashboard</h2>
          <p className="text-muted-foreground">Manage student payments and track revenue</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAlertAllDue} variant="destructive" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alert All Due
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalDue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {dueCount} students pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Students</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCount}</div>
            <p className="text-xs text-muted-foreground">
              {((paidCount / (paidCount + dueCount)) * 100).toFixed(1)}% payment rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Students</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dueCount}</div>
            <p className="text-xs text-muted-foreground">
              Need payment reminders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">All Payments</TabsTrigger>
          <TabsTrigger value="batch-wise">Batch-wise</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Batch-wise Revenue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Batch-wise Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batchStats.map(batch => (
                    <div key={batch.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{batch.name}</p>
                        <p className="text-sm text-muted-foreground">{batch.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{batch.revenue.toLocaleString()}</p>
                        <p className="text-sm text-red-600">₹{batch.due.toLocaleString()} due</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.slice(0, 5).map(payment => (
                    <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.student_name}</p>
                        <p className="text-sm text-muted-foreground">{payment.batch_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{payment.amount}</p>
                        <Badge variant={payment.payment_status === 'paid' ? 'default' : 'destructive'}>
                          {payment.payment_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* All Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search students or batches..."
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
                    <TableHead>Student</TableHead>
                    <TableHead>Batch</TableHead>
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
                      <TableCell className="font-medium">{payment.student_name}</TableCell>
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
                      <TableCell>{payment.due_date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {payment.payment_status === 'due' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleMarkPayment(payment.id, 'paid')}
                                disabled={isLoading}
                              >
                                Mark Paid
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendReminder(payment.student_id)}
                                disabled={isLoading}
                              >
                                <Bell className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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
            {batchStats.map(batch => (
              <Card key={batch.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{batch.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{batch.subject}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-bold text-green-600">₹{batch.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due:</span>
                    <span className="font-bold text-red-600">₹{batch.due.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Students:</span>
                    <span className="font-bold text-green-600">{batch.paid_students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Students:</span>
                    <span className="font-bold text-red-600">{batch.due_students}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Payment Rate:</span>
                      <span className="font-medium">
                        {batch.paid_students + batch.due_students > 0 
                          ? ((batch.paid_students / (batch.paid_students + batch.due_students)) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Overdue Students Tab */}
        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Students with Overdue Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueStudents.map(student => {
                  const studentPayments = payments.filter(p => p.student_id === student.id);
                  const overduePayments = studentPayments.filter(p => p.payment_status === 'due');
                  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0);
                  
                  return (
                    <div key={student.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{student.full_name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="text-sm text-red-600">
                          {overduePayments.length} payment(s) overdue
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">₹{totalOverdue.toLocaleString()}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(student.id)}
                          disabled={isLoading}
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Revenue chart will be implemented here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Payment methods chart will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherPaymentDashboard;
