import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TabsContent } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import ResponsiveLayout from './ResponsiveLayout';
import BatchDetails from './BatchDetails';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard, 
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { 
  mockBatches, 
  mockStudents, 
  mockMaterials, 
  mockAttendance, 
  mockNotifications, 
  mockPayments 
} from '../data';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'paid', 'pending'
  const [paymentSearch, setPaymentSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const { toast } = useToast();

  const getStudentName = (studentId) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const getBatchName = (batchId) => {
    const batch = mockBatches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown';
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get teacher's batches
  const teacherBatches = mockBatches.filter(batch => batch.teacherId === user.id);
  const batchIds = teacherBatches.map(batch => batch.id);
  
  // Get students in teacher's batches
  const teacherStudents = mockStudents.filter(student => 
    student.enrolledBatches.some(batchId => batchIds.includes(batchId))
  );

  // Get materials for teacher's batches
  const teacherMaterials = mockMaterials.filter(material => 
    batchIds.includes(material.batchId)
  );

  // Filter materials based on search
  const filteredMaterials = teacherMaterials.filter(material => {
    const searchTerm = materialSearch.toLowerCase();
    return !materialSearch || 
      material.title.toLowerCase().includes(searchTerm) || 
      getBatchName(material.batchId).toLowerCase().includes(searchTerm) ||
      material.type.toLowerCase().includes(searchTerm);
  });

  // Get attendance for teacher's batches
  const teacherAttendance = mockAttendance.filter(attendance => 
    batchIds.includes(attendance.batchId)
  );

  // Get notifications for teacher's batches
  const teacherNotifications = mockNotifications.filter(notification => 
    batchIds.includes(notification.batchId)
  );

  // Get payments for teacher's students
  const teacherPayments = mockPayments.filter(payment => 
    batchIds.includes(payment.batchId)
  );

  // Filter payments based on status and search
  const filteredPayments = teacherPayments.filter(payment => {
    const matchesFilter = paymentFilter === 'all' || payment.status === paymentFilter;
    const searchTerm = paymentSearch.toLowerCase();
    const studentName = getStudentName(payment.studentId).toLowerCase();
    const batchName = getBatchName(payment.batchId).toLowerCase();
    const matchesSearch = !paymentSearch || 
      studentName.includes(searchTerm) || 
      batchName.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Function to alert students with pending payments
  const alertPendingPayments = () => {
    const pendingPayments = teacherPayments.filter(payment => payment.status === 'pending');
    const pendingStudents = pendingPayments.map(payment => getStudentName(payment.studentId));
    
    if (pendingStudents.length === 0) {
      toast({
        title: "No Pending Payments",
        description: "All students are up to date with their payments.",
        variant: "default"
      });
      return;
    }

    toast({
      title: "Payment Reminders Sent",
      description: `Payment reminders sent to ${pendingStudents.length} students.`,
      variant: "default"
    });

    // Here you would typically call an API to send actual notifications
    console.log("Payment reminders to be sent to:", pendingStudents);
  };

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'batches', label: 'Batches', icon: <Users className="w-4 h-4" /> },
    { value: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { value: 'materials', label: 'Materials', icon: <FileText className="w-4 h-4" /> },
    { value: 'attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> },
    { value: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
  ];

  if (selectedBatch) {
    return (
      <BatchDetails 
        batch={selectedBatch}
        onBack={() => setSelectedBatch(null)}
        userRole="teacher"
        currentUser={user}
      />
    );
  }

  return (
    <ResponsiveLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={logout}
      userName={user.name}
      userRole="teacher"
    >
      {/* Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherBatches.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherStudents.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherMaterials.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherNotifications.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherBatches.slice(0, 3).map(batch => (
                    <div key={batch.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{batch.name}</p>
                        <p className="text-sm text-slate-600">{batch.schedule}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{batch.students.length} students</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedBatch(batch)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherNotifications.slice(0, 3).map(notification => (
                    <div key={notification.id} className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-slate-600">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{notification.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Batches Tab */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">My Batches</h2>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Batch</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherBatches.map(batch => (
              <Card key={batch.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {batch.name}
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedBatch(batch)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>{batch.subject}</CardDescription>
                </CardHeader>
                <CardContent onClick={() => setSelectedBatch(batch)}>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Schedule:</strong> {batch.schedule}</p>
                    <p className="text-sm"><strong>Students:</strong> {batch.students.length}</p>
                    <p className="text-sm"><strong>Duration:</strong> {batch.startDate} to {batch.endDate}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Students</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrolled Batches</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {student.enrolledBatches.filter(batchId => batchIds.includes(batchId)).length} batches
                        </TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusColor(student.paymentStatus)}>
                            {student.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Study Materials</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search materials..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Upload Material</span>
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map(material => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.title}</TableCell>
                        <TableCell>{getBatchName(material.batchId)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{material.type}</Badge>
                        </TableCell>
                        <TableCell>{material.uploadDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Attendance Records</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherAttendance.map(attendance => (
                      <TableRow key={attendance.id}>
                        <TableCell>{attendance.date}</TableCell>
                        <TableCell>{getBatchName(attendance.batchId)}</TableCell>
                        <TableCell>{getStudentName(attendance.studentId)}</TableCell>
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
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Overall Payment</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search student or batch..."
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-2">
                <Button 
                  variant={paymentFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setPaymentFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={paymentFilter === 'paid' ? 'default' : 'outline'}
                  onClick={() => setPaymentFilter('paid')}
                >
                  Payment Done
                </Button>
                <Button 
                  variant={paymentFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setPaymentFilter('pending')}
                >
                  Payment Due
                </Button>
              </div>
              <Button
                variant="secondary"
                onClick={alertPendingPayments}
                className="flex items-center space-x-2"
              >
                <Bell className="w-4 h-4" />
                <span>Alert All Due</span>
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map(payment => (
                      <TableRow key={payment.id}>
                        <TableCell>{getStudentName(payment.studentId)}</TableCell>
                        <TableCell>{getBatchName(payment.batchId)}</TableCell>
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
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Notification</span>
            </Button>
          </div>
          <div className="space-y-4">
            {teacherNotifications.map(notification => (
              <Card key={notification.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {notification.title}
                    <Badge variant="outline">{notification.type}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {getBatchName(notification.batchId)} • {notification.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{notification.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
};

export default TeacherDashboard;