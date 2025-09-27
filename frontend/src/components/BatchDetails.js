import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import AddStudentDialog from './AddStudentDialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Upload
} from 'lucide-react';
import { 
  mockStudents, 
  mockMaterials, 
  mockAttendance, 
  mockNotifications, 
  mockPayments,
  mockTeachers
} from '../data';
import { useToast } from '../hooks/use-toast';
import BatchStudents from './BatchStudents';
import BatchMaterials from './BatchMaterials';
import BatchAttendance from './BatchAttendance';
import BatchPayments from './BatchPayments';
import BatchNotifications from './BatchNotifications';
import AddPaymentDialog from './AddPaymentDialog';

const getPaymentStatusBadgeType = (status) => {
  if (!status) return 'warning';
  switch (status.toLowerCase()) {
    case 'paid':
      return 'success';
    case 'pending':
      return 'warning';
    case 'overdue':
      return 'error';
    default:
      return 'warning';
  }
};

const BatchDetails = ({ batch, onBack, userRole, currentUser }) => {
  // Custom styles based on theme
  const styles = {
    header: "bg-primary text-white shadow-md",
    card: "bg-white border border-neutral-border rounded-lg shadow-sm",
    button: {
      primary: "bg-primary text-white hover:bg-primary-hover",
      secondary: "bg-secondary text-white hover:bg-secondary-hover",
      outline: "border border-neutral-border bg-white text-neutral-dark hover:bg-neutral-bg"
    },
    badge: {
      success: "bg-success-light text-success",
      warning: "bg-warning-light text-warning",
      error: "bg-error-light text-error"
    }
  };
  const [activeTab, setActiveTab] = useState('students'); // Default to students tab
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'PDF' });
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const { toast } = useToast();
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Get batch-specific data
  const batchStudents = mockStudents
    .filter(student => student.enrolledBatches.includes(batch.id))
    .map(student => ({
      ...student,
      paymentStatus: student.paymentStatus || 'pending'  // Provide default status
    }));
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
      case 'paid': return 'bg-success-light text-success';
      case 'pending': return 'bg-warning-light text-warning';
      case 'overdue': return 'bg-error-light text-error';
      default: return 'bg-neutral-bg text-neutral-dark';
    }
  };

  const handleAddStudent = () => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would make an API call
    toast({
      title: "Success",
      description: "Student added to batch successfully",
      variant: "default"
    });
    setSelectedStudent('');
    setShowAddStudent(false);
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

  const handleUpdatePayment = (payment) => {
    setSelectedPayment(payment);
    setShowUpdatePayment(true);
  };

  const handlePaymentStatusUpdate = (status) => {
    if (selectedPayment) {
      toast({
        title: "Payment Updated",
        description: `Payment status updated to ${status} for ${getStudentName(selectedPayment.studentId)} (Demo)`,
        variant: "default"
      });
      setShowUpdatePayment(false);
      setSelectedPayment(null);
    }
  };

  const handleAddPayment = (paymentData) => {
    // In a real app, this would make an API call
    toast({
      title: "Success",
      description: "Payment added successfully (Demo)",
      variant: "default"
    });
    console.log("New Payment Data:", paymentData);
  };

  // Filter batch payments
  const filteredBatchPayments = batchPayments.filter(payment => {
    const matchesFilter = paymentFilter === 'all' || payment.status === paymentFilter;
    const searchTerm = paymentSearch.toLowerCase();
    const studentName = getStudentName(payment.studentId).toLowerCase();
    const matchesSearch = !paymentSearch || studentName.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Header */}
      <header className={`${styles.header} px-4 py-4 sticky top-0 z-50`}>
        <div className="flex items-center space-x-4 max-w-7xl mx-auto">
          <Button 
            className={`${styles.button.outline} !bg-white/10 !text-white flex items-center space-x-2`}
            onClick={onBack}
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{batch.name}</h1>
              <p className="text-sm text-white/80">{batch.subject} • {getTeacherName(batch.teacherId)}</p>
            </div>
            {userRole === 'teacher' && (
              <AddStudentDialog batch={batch} onAddStudent={handleAddStudent} />
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4" >
        {/* Batch Info Card */}
        <Card className={`${styles.card} mb-6`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-neutral-dark">{batch.name}</span>
              <Badge className={styles.badge.success}>{batch.subject}</Badge>
            </CardTitle>
            <CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="font-medium text-neutral-dark">Schedule</p>
                  <p className="text-sm text-neutral">{batch.schedule}</p>
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
          {/* Mobile Tab Navigation */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto space-x-1 p-2 bg-white rounded-lg border">
              <Button
                variant={activeTab === 'students' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('students')}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                <span>Students</span>
              </Button>
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
              <Button
                variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('notifications')}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </Button>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <TabsList className={`${styles.card} hidden md:grid w-full grid-cols-5`}>
            <TabsTrigger value="students" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              <span>Materials</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Calendar className="w-4 h-4" />
              <span>Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <CreditCard className="w-4 h-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <BatchStudents 
              students={batchStudents}
              payments={batchPayments}
              userRole={userRole}
              onSendFeeNotification={sendFeeNotification}
              getPaymentStatusBadgeType={getPaymentStatusBadgeType}
              styles={styles}
            />
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Study Materials</h2>
              {userRole === 'teacher' && (
                <Button onClick={() => setShowAddMaterial(true)} className="flex items-center space-x-2"><Plus className="w-4 h-4" /><span>Add Material</span></Button>
              )}
            </div>
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

            <BatchMaterials 
              materials={batchMaterials}
              userRole={userRole}
              onDeleteMaterial={handleDeleteMaterial}
            />
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <h2 className="text-2xl font-bold">Attendance Records</h2>
            <BatchAttendance attendance={batchAttendance} getStudentName={getStudentName} />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <AddPaymentDialog students={batchStudents} batches={[batch]} onAddPayment={handleAddPayment} />
            <BatchPayments 
              payments={filteredBatchPayments}
              userRole={userRole}
              getStudentName={getStudentName}
              getPaymentStatusColor={getPaymentStatusColor}
              onUpdatePayment={handleUpdatePayment}
              paymentFilter={paymentFilter}
              onFilterChange={setPaymentFilter}
              paymentSearch={paymentSearch}
              onSearchChange={(e) => setPaymentSearch(e.target.value)}
            />
            {showUpdatePayment && selectedPayment && userRole === 'teacher' && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle>Update Payment Status</CardTitle>
                  <CardDescription>
                    Student: {getStudentName(selectedPayment.studentId)} | Amount: ${selectedPayment.amount}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => handlePaymentStatusUpdate('paid')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark as Paid (Cash)
                    </Button>
                    <Button 
                      onClick={() => handlePaymentStatusUpdate('pending')}
                      variant="outline"
                      className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                    >
                      Keep Pending
                    </Button>
                    <Button 
                      onClick={() => handlePaymentStatusUpdate('overdue')}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Mark Overdue
                    </Button>
                    <Button 
                      onClick={() => setShowUpdatePayment(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <BatchNotifications notifications={batchNotifications} userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BatchDetails;