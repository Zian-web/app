import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard, 
  Bell, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { 
  mockBatches, 
  mockStudents, 
  mockMaterials, 
  mockAttendance, 
  mockNotifications, 
  mockPayments 
} from '../mock';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Teacher Portal</h1>
              <p className="text-sm text-slate-600">Welcome, {user.name}</p>
            </div>
          </div>
          <Button 
            onClick={logout}
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="batches" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Batches</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Students</span>
            </TabsTrigger>
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
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
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
                        <div>
                          <p className="font-medium">{batch.name}</p>
                          <p className="text-sm text-slate-600">{batch.schedule}</p>
                        </div>
                        <Badge variant="secondary">{batch.students.length} students</Badge>
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
          </TabsContent>

          {/* Batches Tab */}
          <TabsContent value="batches" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Batches</h2>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Batch</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherBatches.map(batch => (
                <Card key={batch.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {batch.name}
                      <div className="flex space-x-1">
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
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Schedule:</strong> {batch.schedule}</p>
                      <p className="text-sm"><strong>Students:</strong> {batch.students.length}</p>
                      <p className="text-sm"><strong>Duration:</strong> {batch.startDate} to {batch.endDate}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <h2 className="text-2xl font-bold">Students</h2>
            <Card>
              <CardContent className="p-0">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Study Materials</h2>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Upload Material</span>
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
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
                    {teacherMaterials.map(material => (
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <h2 className="text-2xl font-bold">Attendance Records</h2>
            <Card>
              <CardContent className="p-0">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <h2 className="text-2xl font-bold">Payment Status</h2>
            <Card>
              <CardContent className="p-0">
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
                    {teacherPayments.map(payment => (
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;