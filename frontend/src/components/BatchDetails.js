import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Calendar, 
  CreditCard, 
  Bell, 
  Plus,
  Trash2,
  Eye,
  AlertTriangle,
  Upload,
  Download
} from 'lucide-react';
import { 
  mockStudents, 
  mockMaterials, 
  mockAttendance, 
  mockNotifications, 
  mockPayments,
  mockTeachers
} from '../mock';
import { useToast } from '../hooks/use-toast';

const BatchDetails = ({ batch, onBack, userRole, currentUser }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'PDF' });
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const { toast } = useToast();

  // Get batch-specific data
  const batchStudents = mockStudents.filter(student => 
    student.enrolledBatches.includes(batch.id)
  );
  const batchMaterials = mockMaterials.filter(material => 
    material.batchId === batch.id
  );
  const batchAttendance = mockAttendance.filter(attendance => 
    attendance.batchId === batch.id
  );
  const batchNotifications = mockNotifications.filter(notification => 
    notification.batchId === batch.id
  );
  const batchPayments = mockPayments.filter(payment => 
    payment.batchId === batch.id
  );

  const getStudentName = (studentId) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
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

  const handleAddMaterial = () => {
    if (!newMaterial.title) {
      toast({
        title: "Error",
        description: "Please enter material title",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Material added successfully (Demo)",
      variant: "default"
    });
    setNewMaterial({ title: '', type: 'PDF' });
    setShowAddMaterial(false);
  };

  const handleDeleteMaterial = (materialId) => {
    toast({
      title: "Success",
      description: "Material deleted successfully (Demo)",
      variant: "default"
    });
  };

  const sendFeeNotification = (studentId) => {
    toast({
      title: "Notification Sent",
      description: `Fee reminder sent to ${getStudentName(studentId)}`,
      variant: "default"
    });
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
                  <p className="font-medium">Students Enrolled</p>
                  <p className="text-sm">{batchStudents.length} students</p>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white">
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Materials</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid gap-4">
              {batchStudents.map(student => {
                const studentPayments = batchPayments.filter(p => p.studentId === student.id);
                const hasUnpaidFees = studentPayments.some(p => p.status === 'pending' || p.status === 'overdue');
                
                return (
                  <Card key={student.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-slate-600">{student.email}</p>
                          <p className="text-sm text-slate-600">{student.phone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {hasUnpaidFees && userRole === 'teacher' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendFeeNotification(student.id)}
                              className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Fee Alert</span>
                            </Button>
                          )}
                          <Badge className={getPaymentStatusColor(student.paymentStatus)}>
                            {student.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            {userRole === 'teacher' && (
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Study Materials</h2>
                <Button 
                  onClick={() => setShowAddMaterial(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Material</span>
                </Button>
              </div>
            )}

            {/* Add Material Form */}
            {showAddMaterial && userRole === 'teacher' && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Material</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Material Title</Label>
                    <Input
                      id="title"
                      value={newMaterial.title}
                      onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                      placeholder="Enter material title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Material Type</Label>
                    <Select value={newMaterial.type} onValueChange={(value) => setNewMaterial({...newMaterial, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF Document</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Audio">Audio</SelectItem>
                        <SelectItem value="Presentation">Presentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddMaterial}>
                      <Upload className="w-4 h-4 mr-2" />
                      Add Material
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddMaterial(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                        {userRole === 'student' && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline ml-2">Download</span>
                          </Button>
                        )}
                        {userRole === 'teacher' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteMaterial(material.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline ml-2">Delete</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <h2 className="text-2xl font-bold">Attendance Records</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batchAttendance.map(attendance => (
                        <TableRow key={attendance.id}>
                          <TableCell>{attendance.date}</TableCell>
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
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <h2 className="text-2xl font-bold">Payment Records</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Paid Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batchPayments.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell>{getStudentName(payment.studentId)}</TableCell>
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

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Notifications</h2>
              {userRole === 'teacher' && (
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Notice</span>
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {batchNotifications.map(notification => (
                <Card key={notification.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {notification.title}
                      <Badge variant="outline">{notification.type}</Badge>
                    </CardTitle>
                    <CardDescription>{notification.date}</CardDescription>
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

export default BatchDetails;