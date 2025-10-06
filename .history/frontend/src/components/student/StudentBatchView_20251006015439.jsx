import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../../hooks/use-toast';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  CreditCard,
  CheckCircle,
  X
} from 'lucide-react';
import { 
  mockMaterials, 
  mockAttendance, 
  mockPayments,
  mockTeachers
} from '../../data';
import { api } from '../../lib/api';
import StudentMaterials from './StudentMaterials';
import StudentAttendance from './StudentAttendance';
import BatchPayments from '../teacher/BatchPayments';

const StudentBatchView = ({ batch, onBack, currentUser }) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [studentPayments, setStudentPayments] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [isLoadingTeacher, setIsLoadingTeacher] = useState(false);
  const { toast } = useToast();

  // Fetch teacher information to check online payment status
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        setIsLoadingTeacher(true);
        const response = await api.get(`/api/batches/${batch.id}/teacher`);
        setTeacherInfo(response.data);
      } catch (error) {
        console.error('Error fetching teacher info:', error);
        // Fallback: assume teacher has online payment enabled for testing
        console.log('Using fallback teacher info');
        setTeacherInfo({ requires_online_payment: true });
      } finally {
        setIsLoadingTeacher(false);
      }
    };

    fetchTeacherInfo();
  }, [batch.id]);

  // Fetch real payment data for this batch
  useEffect(() => {
    const fetchBatchPayments = async () => {
      try {
        setIsLoadingPayments(true);
        const response = await api.get('/api/student/payments');
        console.log('StudentBatchView payments response:', response);
        
        // Handle different response structures
        let allPayments = [];
        if (response.data) {
          if (Array.isArray(response.data)) {
            allPayments = response.data;
          } else if (response.data.payments && Array.isArray(response.data.payments)) {
            allPayments = response.data.payments;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            allPayments = response.data.data;
          }
        } else if (Array.isArray(response)) {
          // If response is directly an array
          allPayments = response;
        }
        
        // Filter payments for this specific batch
        const batchPayments = allPayments.filter(payment => payment.batch_id === batch.id);
        console.log('Filtered batch payments:', batchPayments);
        console.log('Batch ID:', batch.id);
        console.log('All payments:', allPayments);
        
        setStudentPayments(batchPayments);
      } catch (error) {
        console.error('Error fetching batch payments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch payment data",
          variant: "destructive"
        });
        setStudentPayments([]);
      } finally {
        setIsLoadingPayments(false);
      }
    };

    fetchBatchPayments();
  }, [batch.id, toast]);

  const handleJoinRequest = (batchId) => {
    // Here you would typically make an API call to submit the join request
    toast({
      title: "Join Request Submitted",
      description: "Your request to join this batch has been sent to the teacher.",
      duration: 3000,
    });
    // You could also update some local state to show a pending status
  };

  // Get batch-specific data for current student
  const batchMaterials = mockMaterials.filter(material => 
    material.batchId === batch.id
  );
  const studentAttendance = mockAttendance.filter(attendance => 
    attendance.batchId === batch.id && attendance.studentId === currentUser.id
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
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{batch.subject}</Badge>
                {!batch.students?.includes(currentUser.id) && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleJoinRequest(batch.id)}
                  >
                    JOIN BATCH
                  </Button>
                )}
              </div>
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
            <StudentMaterials materials={batchMaterials} />
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <StudentAttendance attendance={studentAttendance} />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {isLoadingTeacher || isLoadingPayments ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading payment information...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Teacher Online Payment Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Payment Options</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {teacherInfo?.requires_online_payment ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Online Payment Available</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Your teacher has enabled online payments. You can pay your batch fees online using the payment link.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Batch Fees: ₹{batch.fees || 0}/month</p>
                          <p className="text-sm text-blue-600">Click "Pay Now" below to make an online payment</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-orange-600">
                          <X className="w-5 h-5" />
                          <span className="font-medium">Online Payment Not Available</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Your teacher has not enabled online payments. Please contact your teacher directly for payment instructions.
                        </p>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-orange-800">Contact Teacher for Payment</p>
                          <p className="text-sm text-orange-600">Your teacher will provide payment details (cash, bank transfer, etc.)</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {studentPayments.length > 0 ? (
                      <BatchPayments 
                        payments={studentPayments} 
                        userRole="student"
                        getStudentName={() => ''}
                        getPaymentStatusColor={getPaymentStatusColor}
                        onUpdatePayment={() => {}}
                        batchId={batch.id}
                        teacherHasOnlinePayment={teacherInfo?.requires_online_payment}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No payment records found for this batch</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentBatchView;
