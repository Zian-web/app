import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  CreditCard, 
  Eye,
  Download,
  History,
  DollarSign
} from 'lucide-react';
import { 
  mockMaterials, 
  mockAttendance, 
  mockPayments,
  mockTeachers
} from '../mock';
import { useToast } from '../hooks/use-toast';

const StudentBatchView = ({ batch, onBack, currentUser }) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [paymentAmount, setPaymentAmount] = useState('');
  const { toast } = useToast();

  // Get batch-specific data for current student
  const batchMaterials = mockMaterials.filter(material => 
    material.batchId === batch.id
  );
  const studentAttendance = mockAttendance.filter(attendance => 
    attendance.batchId === batch.id && attendance.studentId === currentUser.id
  );
  const studentPayments = mockPayments.filter(payment => 
    payment.batchId === batch.id && payment.studentId === currentUser.id
  );

  const getTeacherName = (teacherId) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown';
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMakePayment = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Payment Successful",
      description: `Payment of $${paymentAmount} processed successfully (Demo)`,
      variant: "default"
    });
    setPaymentAmount('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto">
          <Button 
            onClick={onBack}
            variant="outline" 
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{batch.name}</h1>
            <p className="text-sm text-slate-600">{batch.subject} • {getTeacherName(batch.teacherId)}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Batch Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {batch.name}
              <Badge variant="secondary">{batch.subject}</Badge>
            </CardTitle>
            <CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="font-medium">Schedule</p>
                  <p className="text-sm">{batch.schedule}</p>
                </div>
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-sm">{batch.startDate} to {batch.endDate}</p>
                </div>
                <div>
                  <p className="font-medium">Teacher</p>
                  <p className="text-sm">{getTeacherName(batch.teacherId)}</p>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile Tab Navigation */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto space-x-1 p-2 bg-white rounded-lg border">
              <Button
                variant={activeTab === 'materials' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('materials')}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <FileText className="w-4 h-4" />
                <span>Materials</span>
              </Button>
              <Button
                variant={activeTab === 'attendance' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('attendance')}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>Attendance</span>
              </Button>
              <Button
                variant={activeTab === 'payments' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('payments')}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4" />
                <span>Payments</span>
              </Button>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <TabsList className="hidden md:grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="materials" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Materials</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Payments</span>
            </TabsTrigger>
          </TabsList>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <h2 className="text-2xl font-bold">Study Materials</h2>
            <div className="grid gap-4">
              {batchMaterials.map(material => (
                <Card key={material.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{material.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{material.type}</Badge>
                          <span className="text-sm text-slate-600">{material.uploadDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline ml-2">View</span>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline ml-2">Download</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <h2 className="text-2xl font-bold">My Attendance</h2>
            
            {/* Attendance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentAttendance.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Present</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {studentAttendance.filter(a => a.status === 'present').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {studentAttendance.length > 0 
                      ? Math.round((studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100)
                      : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Records */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentAttendance.map(attendance => (
                        <TableRow key={attendance.id}>
                          <TableCell>{attendance.date}</TableCell>
                          <TableCell>
                            <Badge className={attendance.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {attendance.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <h2 className="text-2xl font-bold">Payment Management</h2>

            {/* Payment Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Make Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Make Payment</span>
                  </CardTitle>
                  <CardDescription>
                    Make a payment for this batch
                  </CardDescription>
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
                  <Button 
                    onClick={handleMakePayment}
                    className="w-full"
                    disabled={!paymentAmount}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Make Payment
                  </Button>
                  <p className="text-sm text-slate-600">
                    Note: This is a demo. No actual payment will be processed.
                  </p>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Payment Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Payments:</span>
                      <span className="font-medium">{studentPayments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paid Amount:</span>
                      <span className="font-medium text-green-600">
                        ${studentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Amount:</span>
                      <span className="font-medium text-red-600">
                        ${studentPayments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Paid Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentPayments.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell>${payment.amount}</TableCell>
                          <TableCell>{payment.dueDate}</TableCell>
                          <TableCell>
                            <Badge className={getPaymentStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.paidDate || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentBatchView;