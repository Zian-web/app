import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Calendar, 
  CreditCard, 
  Bell, 
  CheckCircle,
  X
} from 'lucide-react';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';
import { useToast } from '../../hooks/use-toast';
import StudentMaterials from './StudentMaterials';
import StudentAttendance from './StudentAttendance';
import BatchPayments from '../teacher/BatchPayments';

const StudentBatchDetails = ({ batch, onBack, currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [materials, setMaterials] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isLoadingTeacher, setIsLoadingTeacher] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [batch.id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [materialsData, attendanceData, notificationsData] = await Promise.allSettled([
        api.get(ENDPOINTS.BATCH.MATERIALS.LIST(batch.id)),
        api.get(`/api/student/batches/${batch.id}/attendance`),
        api.get(ENDPOINTS.BATCH.NOTIFICATIONS.LIST(batch.id))
      ]);

      // Handle materials
      if (materialsData.status === 'fulfilled') {
        setMaterials(materialsData.value.data || materialsData.value || []);
      }

      // Handle attendance
      if (attendanceData.status === 'fulfilled') {
        setAttendance(attendanceData.value.data || attendanceData.value || []);
      }

      // Handle notifications
      if (notificationsData.status === 'fulfilled') {
        setNotifications(notificationsData.value.data || notificationsData.value || []);
      }

      // Fetch teacher info and payments separately
      await fetchTeacherInfo();
      await fetchPayments();
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

  const fetchTeacherInfo = async () => {
    setIsLoadingTeacher(true);
    try {
      const response = await api.get(`/api/batches/${batch.id}/teacher`);
      console.log('Teacher info response:', response);
      setTeacherInfo(response.data || response);
    } catch (error) {
      console.error('Error fetching teacher info:', error);
      // Fallback for testing
      setTeacherInfo({ requires_online_payment: true });
    } finally {
      setIsLoadingTeacher(false);
    }
  };

  const fetchPayments = async () => {
    setIsLoadingPayments(true);
    try {
      const response = await api.get(ENDPOINTS.PAYMENTS.STUDENT.LIST);
      console.log('Student payments response:', response);
      
      // Handle different response structures
      let allPayments = [];
      if (response.data) {
        allPayments = response.data;
      } else if (Array.isArray(response)) {
        allPayments = response;
      }
      
      // Filter payments for this batch
      const batchPayments = allPayments.filter(payment => payment.batch_id === batch.id);
      console.log('Filtered batch payments:', batchPayments);
      
      setPayments(batchPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment data",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPayments(false);
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
            ₹{batch.fees}/month
          </Badge>
        </div>
      </div>

      {/* Payment Status Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isLoadingTeacher ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              ) : teacherInfo?.requires_online_payment ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
              <div>
                <h3 className="font-semibold">
                  {isLoadingTeacher ? 'Loading...' : 
                   teacherInfo?.requires_online_payment ? 'Online Payment Available' : 'Online Payment Not Available'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isLoadingTeacher ? 'Checking payment options...' :
                   teacherInfo?.requires_online_payment ? 
                   'You can pay your fees online using the Pay Now button below' : 
                   'Please contact your teacher for payment instructions'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
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
                <CardTitle className="text-sm font-medium">Available Materials</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materials.length}</div>
                <p className="text-xs text-muted-foreground">
                  Study resources
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendance.length > 0 ? 
                    `${Math.round((attendance.filter(a => a.present).length / attendance.length) * 100)}%` : 
                    'N/A'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Attendance rate
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
                  Per month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Batch Information */}
          <Card>
            <CardHeader>
              <CardTitle>Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Schedule</Label>
                  <p className="text-sm">{batch.schedule || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Duration</Label>
                  <p className="text-sm">{batch.duration || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                  <p className="text-sm">
                    {batch.start_date ? new Date(batch.start_date).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">End Date</Label>
                  <p className="text-sm">
                    {batch.end_date ? new Date(batch.end_date).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <StudentMaterials 
            materials={materials}
            batchId={batch.id}
          />
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <StudentAttendance 
            attendance={attendance}
            batchId={batch.id}
          />
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          {isLoadingPayments ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading payments...</p>
              </div>
            </div>
          ) : payments.length > 0 ? (
            <BatchPayments 
              payments={payments}
              userRole="student"
              getStudentName={() => currentUser?.name || 'You'}
              getPaymentStatusColor={(status) => {
                switch (status) {
                  case 'paid': return 'success';
                  case 'pending': return 'warning';
                  case 'overdue': return 'destructive';
                  default: return 'secondary';
                }
              }}
              onUpdatePayment={fetchPayments}
              batchId={batch.id}
              teacherHasOnlinePayment={teacherInfo?.requires_online_payment || false}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payment Records</h3>
                <p className="text-gray-600 mb-4">
                  No payment records found for this batch.
                </p>
                {teacherInfo?.requires_online_payment ? (
                  <p className="text-sm text-green-600">
                    Online payment is available. Contact your teacher to set up payments.
                  </p>
                ) : (
                  <p className="text-sm text-orange-600">
                    Online payment is not available. Please contact your teacher for payment instructions.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                  <p className="text-gray-600">
                    No notifications from your teacher yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentBatchDetails;
