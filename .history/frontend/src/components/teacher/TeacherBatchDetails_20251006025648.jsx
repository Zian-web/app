import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import AddPaymentDialog from '../forms/AddPaymentDialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Calendar, 
  CreditCard, 
  Bell, 
  Plus, 
  Upload,
  UserPlus,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import BatchJoiningRequests from './BatchJoiningRequests';
import { 
  getBatchStudents,
  getJoiningRequests,
  approveJoinRequest,
  rejectJoinRequest,
  createNotification,
  getNotificationsForBatch,
  getBatchMaterials,
  uploadMaterial,
  deleteMaterial,
  removeStudent
} from '../../lib/api';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';
import { useToast } from '../../hooks/use-toast';
import BatchStudents from './BatchStudents';
import BatchMaterials from './BatchMaterials';
import BatchAttendance from './BatchAttendance';
import BatchPayments from './BatchPayments';
import BatchNotifications from './BatchNotifications';
import { Textarea } from '../ui/textarea';

const TeacherBatchDetails = ({ batch, onBack, currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [joiningRequests, setJoiningRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [batch.id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [studentsData, materialsData, paymentsData, notificationsData, joiningRequestsData] = await Promise.allSettled([
        getBatchStudents(batch.id),
        getBatchMaterials(batch.id),
        api.get(ENDPOINTS.PAYMENTS.TEACHER.LIST),
        getNotificationsForBatch(batch.id),
        getJoiningRequests(batch.id)
      ]);

      // Handle students
      if (studentsData.status === 'fulfilled') {
        setStudents(studentsData.value || []);
      }

      // Handle materials
      if (materialsData.status === 'fulfilled') {
        setMaterials(materialsData.value || []);
      }

      // Handle attendance - using mock data for now
      setAttendance([]);

      // Handle payments - filter by batch
      if (paymentsData.status === 'fulfilled') {
        const allPayments = paymentsData.value.data || paymentsData.value || [];
        console.log('All payments from API:', allPayments);
        console.log('Current batch ID:', batch.id);
        const batchPayments = allPayments.filter(payment => payment.batch_id === batch.id);
        console.log('Filtered batch payments:', batchPayments);
        console.log('Payment statuses:', batchPayments.map(p => ({ id: p.id, status: p.status, payment_status: p.payment_status })));
        setPayments(batchPayments);
      }

      // Handle notifications
      if (notificationsData.status === 'fulfilled') {
        setNotifications(notificationsData.value || []);
      }

      // Handle joining requests
      if (joiningRequestsData.status === 'fulfilled') {
        setJoiningRequests(joiningRequestsData.value || []);
      }
    } catch (error) {
      console.error('Error fetching batch data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch batch data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await approveJoinRequest(requestId);
      setJoiningRequests(prev => prev.filter(req => req.id !== requestId));
      toast({
        title: "Success",
        description: "Join request approved",
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive"
      });
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectJoinRequest(requestId);
      setJoiningRequests(prev => prev.filter(req => req.id !== requestId));
      toast({
        title: "Success",
        description: "Join request rejected",
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive"
      });
    }
  };

  const handleCreateNotification = async () => {
    if (!notificationTitle || !notificationMessage) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await createNotification(batch.id, {
        title: notificationTitle,
        message: notificationMessage
      });
      setNotificationTitle('');
      setNotificationMessage('');
      setShowAddNotification(false);
      toast({
        title: "Success",
        description: "Notification created successfully",
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive"
      });
    }
  };

  const handleUploadMaterial = async () => {
    if (!selectedFile || !materialTitle) {
      toast({
        title: "Error",
        description: "Please select a file and enter a title",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', materialTitle);
      if (materialDescription) {
        formData.append('description', materialDescription);
      }
      
      const response = await api.post(`/api/batches/${batch.id}/materials/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Material upload response:', response);
      setSelectedFile(null);
      setMaterialTitle('');
      setMaterialDescription('');
      setShowAddMaterial(false);
      toast({
        title: "Success",
        description: "Material uploaded successfully",
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error uploading material:', error);
      toast({
        title: "Error",
        description: "Failed to upload material",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await removeStudent(batch.id, studentId);
      setStudents(prev => prev.filter(student => student.id !== studentId));
      toast({
        title: "Success",
        description: "Student removed from batch",
      });
    } catch (error) {
      console.error('Error removing student:', error);
      toast({
        title: "Error",
        description: "Failed to remove student",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      await deleteMaterial(materialId);
      setMaterials(prev => prev.filter(material => material.id !== materialId));
      toast({
        title: "Success",
        description: "Material deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive"
      });
    }
  };

  const createTestPayments = async () => {
    try {
      const testPayments = [
        {
          batch_id: batch.id,
          student_id: students[0]?.id || 1,
          amount: batch.fees || 1000,
          months_paid: 1,
          payment_status: 'due',
          payment_mode: 'online',
          due_date: new Date().toISOString()
        },
        {
          batch_id: batch.id,
          student_id: students[1]?.id || 2,
          amount: batch.fees || 1000,
          months_paid: 1,
          payment_status: 'paid',
          payment_mode: 'cash',
          payment_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      for (const payment of testPayments) {
        try {
          await api.post(ENDPOINTS.PAYMENTS.CREATE, payment);
        } catch (error) {
          console.log('Test payment creation failed (expected if endpoint not implemented):', error);
        }
      }

      toast({
        title: "Success",
        description: "Test payments created",
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating test payments:', error);
      toast({
        title: "Error",
        description: "Failed to create test payments",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading batch details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{batch.name}</h1>
            <p className="text-gray-600">{batch.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {students.length} students
          </Badge>
          <Badge variant="outline">
            ₹{batch.fees}/month
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
                <p className="text-xs text-muted-foreground">
                  {joiningRequests.length} pending requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Materials</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materials.length}</div>
                <p className="text-xs text-muted-foreground">
                  Available resources
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Fee</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{batch.fees}</div>
                <p className="text-xs text-muted-foreground">
                  Per student per month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowAddNotification(true)} className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Send Notification
                </Button>
                <Button onClick={() => setShowAddMaterial(true)} className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Material
                </Button>
                <Button onClick={() => setShowAddPayment(true)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Payment
                </Button>
                <Button onClick={createTestPayments} variant="outline" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Create Test Payments
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <BatchStudents 
            students={students}
            payments={payments}
            userRole="teacher"
            onRemoveStudent={handleRemoveStudent}
            batchId={batch.id}
            getPaymentStatusBadgeType={(status) => {
              switch (status) {
                case 'paid': return 'success';
                case 'pending': return 'warning';
                case 'overdue': return 'destructive';
                default: return 'secondary';
              }
            }}
          />
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Study Materials</h3>
              <Button onClick={() => setShowAddMaterial(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
            
            <BatchMaterials 
              materials={materials}
              onUploadMaterial={handleUploadMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              batchId={batch.id}
            />
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <BatchAttendance 
            attendance={attendance}
            students={students}
            batchId={batch.id}
          />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Payments</p>
                      <p className="text-2xl font-bold">{payments.length}</p>
                      <p className="text-xs text-muted-foreground">Debug: {JSON.stringify(payments.slice(0, 2))}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Paid</p>
                      <p className="text-2xl font-bold text-green-600">
                        {payments.filter(p => p.payment_status === 'paid' || p.status === 'paid').length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Debug: {payments.filter(p => p.payment_status === 'paid' || p.status === 'paid').length} paid
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Due</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {payments.filter(p => p.payment_status === 'due' || p.status === 'pending').length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Debug: {payments.filter(p => p.payment_status === 'due' || p.status === 'pending').length} due
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add Payment Button */}
            <div className="flex justify-end">
              <Button onClick={() => setShowAddPayment(true)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </div>

            {/* Payment Records */}
            <BatchPayments 
              payments={payments}
              userRole="teacher"
              getStudentName={(studentId) => {
                const student = students.find(s => s.id === studentId);
                return student ? student.name : 'Unknown Student';
              }}
              getPaymentStatusColor={(status) => {
                switch (status) {
                  case 'paid': return 'success';
                  case 'pending': return 'warning';
                  case 'overdue': return 'destructive';
                  default: return 'secondary';
                }
              }}
              onUpdatePayment={fetchData}
              batchId={batch.id}
              teacherHasOnlinePayment={true}
              paymentFilter="all"
              onFilterChange={() => {}}
              paymentSearch=""
              onSearchChange={() => {}}
            />
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <BatchNotifications 
            notifications={notifications}
            onCreateNotification={handleCreateNotification}
            batchId={batch.id}
          />
        </TabsContent>
      </Tabs>

      {/* Add Payment Dialog */}
      <AddPaymentDialog 
        students={students}
        batches={[batch]}
        onAddPayment={async (paymentData) => {
          try {
            await api.post(ENDPOINTS.PAYMENTS.CREATE, {
              ...paymentData,
              batch_id: batch.id,
              payment_status: 'due',
              payment_mode: paymentData.paymentMethod.toLowerCase()
            });
            toast({
              title: "Success",
              description: "Payment added successfully",
            });
            fetchData(); // Refresh data
          } catch (error) {
            console.error('Error adding payment:', error);
            toast({
              title: "Error",
              description: "Failed to add payment",
              variant: "destructive"
            });
          }
        }}
      />

      {/* Add Notification Dialog */}
      <Dialog open={showAddNotification} onOpenChange={setShowAddNotification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Notification</DialogTitle>
            <DialogDescription>
              Send a notification to all students in this batch.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="Enter notification title"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter notification message"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNotification(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNotification}>
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Material Dialog */}
      <Dialog open={showAddMaterial} onOpenChange={setShowAddMaterial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Material</DialogTitle>
            <DialogDescription>
              Upload a new material for this batch.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </div>
            <div>
              <Label htmlFor="materialTitle">Title</Label>
              <Input
                id="materialTitle"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="Enter material title"
              />
            </div>
            <div>
              <Label htmlFor="materialDescription">Description</Label>
              <Textarea
                id="materialDescription"
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                placeholder="Enter material description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMaterial(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadMaterial} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Material'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherBatchDetails;
