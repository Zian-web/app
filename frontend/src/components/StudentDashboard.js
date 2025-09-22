import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import ResponsiveLayout from './ResponsiveLayout';
import StudentBatchView from './StudentBatchView';
import { 
  BookOpen, 
  FileText, 
  CreditCard, 
  Calendar,
  User,
  Eye
} from 'lucide-react';
import { 
  mockBatches, 
  mockMaterials, 
  mockAttendance, 
  mockNotifications, 
  mockPayments,
  mockTeachers
} from '../mock';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Get student's enrolled batches
  const studentBatches = mockBatches.filter(batch => 
    user.enrolledBatches.includes(batch.id)
  );
  const batchIds = user.enrolledBatches;

  // Get materials for student's batches
  const studentMaterials = mockMaterials.filter(material => 
    batchIds.includes(material.batchId)
  );

  // Get attendance for student
  const studentAttendance = mockAttendance.filter(attendance => 
    attendance.studentId === user.id
  );

  // Get notifications for student's batches
  const studentNotifications = mockNotifications.filter(notification => 
    batchIds.includes(notification.batchId)
  );

  // Get payments for student
  const studentPayments = mockPayments.filter(payment => 
    payment.studentId === user.id
  );

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'batches', label: 'My Batches', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'materials', label: 'Materials', icon: <FileText className="w-4 h-4" /> },
    { value: 'attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> },
    { value: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> }
  ];

  const getBatchName = (batchId) => {
    const batch = mockBatches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown';
  };

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

  if (selectedBatch) {
    return (
      <StudentBatchView 
        batch={selectedBatch}
        onBack={() => setSelectedBatch(null)}
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
      userRole="student"
    >
      {/* Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Batches</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentBatches.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentMaterials.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentAttendance.length > 0 
                    ? Math.round((studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100)
                    : 0}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentPayments.filter(p => p.status === 'pending' || p.status === 'overdue').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentBatches.slice(0, 3).map(batch => (
                    <div key={batch.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{batch.name}</p>
                        <p className="text-sm text-slate-600">{getTeacherName(batch.teacherId)}</p>
                        <p className="text-sm text-slate-600">{batch.schedule}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{batch.subject}</Badge>
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
                  {studentNotifications.slice(0, 3).map(notification => (
                    <div key={notification.id} className="p-3 bg-slate-50 rounded-lg">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-slate-600">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{getBatchName(notification.batchId)} • {notification.date}</p>
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
          <h2 className="text-2xl font-bold">My Enrolled Batches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentBatches.map(batch => (
              <Card key={batch.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{batch.name}</CardTitle>
                  <CardDescription>{batch.subject}</CardDescription>
                </CardHeader>
                <CardContent onClick={() => setSelectedBatch(batch)}>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Teacher:</strong> {getTeacherName(batch.teacherId)}</p>
                    <p className="text-sm"><strong>Schedule:</strong> {batch.schedule}</p>
                    <p className="text-sm"><strong>Duration:</strong> {batch.startDate} to {batch.endDate}</p>
                    <div className="pt-2">
                      <Button size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Study Materials</h2>
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
                    {studentMaterials.map(material => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.title}</TableCell>
                        <TableCell>{getBatchName(material.batchId)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{material.type}</Badge>
                        </TableCell>
                        <TableCell>{material.uploadDate}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
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

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Attendance</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentAttendance.map(attendance => (
                      <TableRow key={attendance.id}>
                        <TableCell>{attendance.date}</TableCell>
                        <TableCell>{getBatchName(attendance.batchId)}</TableCell>
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
          <h2 className="text-2xl font-bold">Payment History</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentPayments.map(payment => (
                      <TableRow key={payment.id}>
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

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Student ID</label>
                  <p className="text-slate-900">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <p className="text-slate-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <p className="text-slate-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <p className="text-slate-900">{user.phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Enrolled Batches</label>
                  <div className="mt-2 space-y-2">
                    {studentBatches.map(batch => (
                      <div key={batch.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <span className="text-sm">{batch.name}</span>
                        <Badge variant="secondary" className="text-xs">{batch.subject}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Overall Payment Status</label>
                  <Badge className={`mt-1 ${getPaymentStatusColor(user.paymentStatus)}`}>
                    {user.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
};

export default StudentDashboard;