import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { 
  Bell, 
  Send, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users,
  Calendar,
  MessageSquare,
  Settings,
  History,
  Filter,
  Search,
  Mail,
  Phone,
  MessageCircle,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const PaymentReminderSystem = ({ batches = [], students = [] }) => {
  const [activeTab, setActiveTab] = useState('overdue');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [reminderType, setReminderType] = useState('payment_due');
  const [customMessage, setCustomMessage] = useState('');
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  // Mock data - replace with actual API calls
  const mockOverdueStudents = [
    {
      id: 1,
      student_id: 1,
      student_name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      batch_id: 1,
      batch_name: 'Math Class A',
      amount_due: 500,
      days_overdue: 5,
      last_reminder: '2024-01-15',
      reminder_count: 2,
      status: 'overdue'
    },
    {
      id: 2,
      student_id: 2,
      student_name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543211',
      batch_id: 1,
      batch_name: 'Math Class A',
      amount_due: 500,
      days_overdue: 3,
      last_reminder: '2024-01-16',
      reminder_count: 1,
      status: 'overdue'
    },
    {
      id: 3,
      student_id: 3,
      student_name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+91 9876543212',
      batch_id: 2,
      batch_name: 'Science Class B',
      amount_due: 750,
      days_overdue: 7,
      last_reminder: '2024-01-14',
      reminder_count: 3,
      status: 'overdue'
    }
  ];

  const mockReminderHistory = [
    {
      id: 1,
      student_name: 'John Doe',
      batch_name: 'Math Class A',
      reminder_type: 'payment_due',
      sent_at: '2024-01-15 10:30:00',
      status: 'sent',
      method: 'email',
      message: 'Your payment of ₹500 is due for Math Class A. Please make the payment to continue accessing materials.'
    },
    {
      id: 2,
      student_name: 'Jane Smith',
      batch_name: 'Math Class A',
      reminder_type: 'payment_overdue',
      sent_at: '2024-01-16 14:20:00',
      status: 'delivered',
      method: 'sms',
      message: 'Reminder: Your payment of ₹500 for Math Class A is overdue. Please pay immediately.'
    },
    {
      id: 3,
      student_name: 'Bob Johnson',
      batch_name: 'Science Class B',
      reminder_type: 'final_warning',
      sent_at: '2024-01-14 09:15:00',
      status: 'failed',
      method: 'email',
      message: 'Final warning: Your payment of ₹750 for Science Class B is overdue. Materials will be locked if payment is not received.'
    }
  ];

  const [overdueStudents, setOverdueStudents] = useState(mockOverdueStudents);
  const [reminderHistory, setReminderHistory] = useState(mockReminderHistory);

  // Filter students based on search and status
  const filteredStudents = overdueStudents.filter(student => {
    const matchesSearch = student.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.batch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.student_id));
    }
  };

  const handleSendReminder = async (studentIds, type, message) => {
    try {
      setIsLoading(true);
      
      // API call to send reminders
      const response = await Promise.all(
        studentIds.map(studentId => 
          // sendReminderAPI(studentId, type, message)
          new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call
        )
      );

      toast({
        title: "Reminders Sent",
        description: `Successfully sent ${studentIds.length} reminder(s)`,
        variant: "default"
      });

      setShowReminderDialog(false);
      setSelectedStudents([]);
      setCustomMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkReminder = async () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select students to send reminders",
        variant: "destructive"
      });
      return;
    }

    setShowReminderDialog(true);
  };

  const getReminderTemplate = (type) => {
    const templates = {
      payment_due: "Your payment is due. Please make the payment to continue accessing materials.",
      payment_overdue: "Your payment is overdue. Please pay immediately to avoid any restrictions.",
      final_warning: "Final warning: Your payment is overdue. Materials will be locked if payment is not received.",
      custom: customMessage || "Please make your payment to continue accessing course materials."
    };
    return templates[type] || templates.payment_due;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue': return 'destructive';
      case 'due_soon': return 'secondary';
      case 'paid': return 'default';
      default: return 'outline';
    }
  };

  const getReminderStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'default';
      case 'delivered': return 'default';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Payment Reminders</h2>
          <p className="text-muted-foreground">Manage payment reminders and alerts for students</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleBulkReminder}
            disabled={selectedStudents.length === 0}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Bulk Reminders ({selectedStudents.length})
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount Due</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₹{overdueStudents.reduce((sum, s) => sum + s.amount_due, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all batches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders Sent</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reminderHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((reminderHistory.filter(r => r.status === 'delivered').length / reminderHistory.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Delivery success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overdue">Overdue Students</TabsTrigger>
          <TabsTrigger value="reminders">Send Reminders</TabsTrigger>
          <TabsTrigger value="history">Reminder History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overdue Students Tab */}
        <TabsContent value="overdue" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search students, batches, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="due_soon">Due Soon</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Students Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Amount Due</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Last Reminder</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student.student_id)}
                          onCheckedChange={() => handleSelectStudent(student.student_id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.student_name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{student.batch_name}</TableCell>
                      <TableCell className="font-bold text-red-600">₹{student.amount_due}</TableCell>
                      <TableCell>
                        <span className="text-orange-600 font-medium">{student.days_overdue} days</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{student.last_reminder}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.reminder_count} reminders sent
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedStudents([student.student_id]);
                              setShowReminderDialog(true);
                            }}
                          >
                            <Bell className="w-4 h-4 mr-2" />
                            Remind
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Show student details
                            }}
                          >
                            <Users className="w-4 h-4" />
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

        {/* Send Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Quick Reminder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reminder Type</label>
                  <Select value={reminderType} onValueChange={setReminderType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment_due">Payment Due</SelectItem>
                      <SelectItem value="payment_overdue">Payment Overdue</SelectItem>
                      <SelectItem value="final_warning">Final Warning</SelectItem>
                      <SelectItem value="custom">Custom Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {reminderType === 'custom' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Custom Message</label>
                    <Textarea
                      placeholder="Enter your custom reminder message..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <p className="text-sm text-muted-foreground">
                    {getReminderTemplate(reminderType)}
                  </p>
                </div>

                <Button 
                  onClick={() => setShowReminderDialog(true)}
                  className="w-full"
                  disabled={selectedStudents.length === 0}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to {selectedStudents.length} Selected Students
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Reminder Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Payment Due</span>
                      <Badge variant="outline">Standard</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Your payment is due. Please make the payment to continue accessing materials."
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Payment Overdue</span>
                      <Badge variant="secondary">Urgent</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Your payment is overdue. Please pay immediately to avoid any restrictions."
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Final Warning</span>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Final warning: Your payment is overdue. Materials will be locked if payment is not received."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reminder History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Reminder History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminderHistory.map(reminder => (
                    <TableRow key={reminder.id}>
                      <TableCell className="font-medium">{reminder.student_name}</TableCell>
                      <TableCell>{reminder.batch_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {reminder.reminder_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {reminder.method === 'email' ? (
                            <Mail className="w-4 h-4" />
                          ) : (
                            <MessageCircle className="w-4 h-4" />
                          )}
                          <span className="capitalize">{reminder.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>{reminder.sent_at}</TableCell>
                      <TableCell>
                        <Badge variant={getReminderStatusColor(reminder.status)}>
                          {reminder.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {reminder.message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Due Template</label>
                  <Textarea
                    defaultValue="Hi {student_name}, your payment of ₹{amount} for {batch_name} is due on {due_date}. Please make the payment to continue accessing materials."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Overdue Template</label>
                  <Textarea
                    defaultValue="Hi {student_name}, your payment of ₹{amount} for {batch_name} is overdue by {days_overdue} days. Please pay immediately to avoid restrictions."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Final Warning Template</label>
                  <Textarea
                    defaultValue="Final warning: Hi {student_name}, your payment of ₹{amount} for {batch_name} is overdue. Materials will be locked if payment is not received within 24 hours."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Confirmation Template</label>
                  <Textarea
                    defaultValue="Thank you {student_name}! Your payment of ₹{amount} for {batch_name} has been received. You can continue accessing materials."
                    rows={3}
                  />
                </div>
              </div>
              <Button className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Save Templates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Automatic Reminders</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm">Send reminder 2 days before due date</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm">Send reminder on due date</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm">Send reminder 1 day after due date</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm">Send reminder 3 days after due date</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox />
                      <span className="text-sm">Send reminder 7 days after due date</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reminder Methods</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm">Email reminders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm">SMS reminders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox />
                      <span className="text-sm">WhatsApp reminders</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Reminders per Student</label>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 reminders</SelectItem>
                      <SelectItem value="5">5 reminders</SelectItem>
                      <SelectItem value="10">10 reminders</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Selected Students: {selectedStudents.length}</p>
              <p className="text-sm text-muted-foreground">
                Reminder will be sent to all selected students
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reminder Type</label>
              <Select value={reminderType} onValueChange={setReminderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment_due">Payment Due</SelectItem>
                  <SelectItem value="payment_overdue">Payment Overdue</SelectItem>
                  <SelectItem value="final_warning">Final Warning</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reminderType === 'custom' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Message</label>
                <Textarea
                  placeholder="Enter your custom reminder message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                />
              </div>
            )}

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <p className="text-sm text-muted-foreground">
                {getReminderTemplate(reminderType)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleSendReminder(selectedStudents, reminderType, customMessage)}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Sending...' : 'Send Reminder'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReminderDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentReminderSystem;
