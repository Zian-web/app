import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import AddPaymentDialog from '../forms/AddPaymentDialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import ErrorBoundary from './ErrorBoundary';
import EmptyState from './EmptyState';
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
  UserPlus
} from 'lucide-react';
import BatchJoiningRequests from '../teacher/BatchJoiningRequests';
import { 
  getBatchStudents,
  getJoiningRequests,
  approveJoinRequest,
  rejectJoinRequest,
  createNotification,
  getNotificationsForBatch,
  getBatchMaterials,
  getPaymentsForBatch,
  uploadMaterial,
  deleteMaterial
} from '../../lib/api';
import { useToast } from '../../hooks/use-toast';
import BatchStudents from '../teacher/BatchStudents';
import BatchMaterials from '../teacher/BatchMaterials';
import BatchAttendance from '../teacher/BatchAttendance';
import BatchPayments from '../teacher/BatchPayments';
import BatchNotifications from '../teacher/BatchNotifications';
import { Textarea } from '../ui/textarea';

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
  const styles = {
    card: "bg-white border border-neutral-border rounded-lg shadow-sm",
    badge: {
      success: "bg-success-light text-success",
      warning: "bg-warning-light text-warning",
      error: "bg-error-light text-error"
    }
  };
  const [activeTab, setActiveTab] = useState(userRole === 'student' ? 'materials' : 'students');
  const [newMaterial, setNewMaterial] = useState({ title: '', file: null });
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);
  const { toast } = useToast();
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');

  const [batchStudents, setBatchStudents] = useState([]);
  const [joiningRequests, setJoiningRequests] = useState([]);
  const [batchNotifications, setBatchNotifications] = useState([]);
  const [batchMaterials, setBatchMaterials] = useState([]);
  const [batchAttendance, setBatchAttendance] = useState([]);
  const [batchPayments, setBatchPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-success-light text-success';
      case 'pending': return 'bg-warning-light text-warning';
      case 'overdue': return 'bg-error-light text-error';
      default: return 'bg-neutral-bg text-neutral-dark';
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await Promise.allSettled([
        getBatchStudents(batch.id),
        getJoiningRequests(batch.id),
        getNotificationsForBatch(batch.id),
        getBatchMaterials(batch.id),
        getPaymentsForBatch(batch.id)
      ]);

      const [students, requests, notifications, materials, payments] = results;

      const errors = results.filter(result => result.status === 'rejected');
      if (errors.length > 0) {
        // If there are any 403 errors for materials, handle them specially
        const materialError = errors.find(e => e.reason?.status === 403 && e.reason?.message?.includes('materials'));
        if (materialError) {
          toast({
            title: "Access Restricted",
            description: "You don't have permission to access materials for this batch.",
            variant: "warning"
          });
        } else {
          throw new Error("Failed to fetch some batch details. Please try again.");
        }
      }

      if (students.status === 'fulfilled') setBatchStudents(students.value || []);
      if (requests.status === 'fulfilled') setJoiningRequests(requests.value || []);
      if (notifications.status === 'fulfilled') setBatchNotifications(notifications.value || []);
      if (materials.status === 'fulfilled') setBatchMaterials(materials.value || []);
      if (payments.status === 'fulfilled') setBatchPayments(payments.value || []);

    } catch (err) {
      setError(err.message);
      toast({ 
        title: "Error",
        description: err.message || "Failed to fetch some batch details.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (batch?.id) {
      fetchData();
    }
  }, [batch]);

  const getStudentName = (studentId) => {
    const student = batchStudents.find(s => s.id === studentId);
    return student ? student.full_name : 'Unknown';
  };

  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingNotification, setIsCreatingNotification] = useState(false);

  const handleAddMaterial = async () => {
    if (!newMaterial.title || !newMaterial.file) {
      toast({ title: "Error", description: "Please provide a title and select a file.", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append('title', newMaterial.title);
    formData.append('file', newMaterial.file);
    try {
      setIsUploading(true);
      await uploadMaterial(batch.id, formData);
      toast({ title: "Success", description: "Material uploaded successfully." });
      const updatedMaterials = await getBatchMaterials(batch.id);
      setBatchMaterials(updatedMaterials || []);
      setNewMaterial({ title: '', file: null });
      setShowAddMaterial(false);
    } catch (error) {
      toast({ title: "Upload Failed", description: error.message || "An error occurred while uploading the material.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      if (!materialId) {
        toast({ title: "Error", description: "Cannot delete material: Invalid ID.", variant: "destructive" });
        return;
      }
      await deleteMaterial(materialId);
      toast({ title: "Success", description: "Material deleted successfully" });
      const updatedMaterials = await getBatchMaterials(batch.id);
      setBatchMaterials(updatedMaterials || []);
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({ title: "Error", description: error.message || "Failed to delete material", variant: "destructive" });
    }
  };

  // Mock implementation, as there is no backend API to send a notification to a single student.
  const sendFeeNotification = (studentId) => {
    toast({ title: "Notification Sent", description: `Fee reminder sent to ${getStudentName(studentId)}` });
  };

  const handleUpdatePayment = (payment) => {
    setSelectedPayment(payment);
    setShowUpdatePayment(true);
  };

  const handlePaymentStatusUpdate = (status) => {
    if (selectedPayment) {
      toast({ title: "Payment Updated", description: `Payment status updated to ${status} for ${getStudentName(selectedPayment.studentId)} (Demo)` });
      setShowUpdatePayment(false);
      setSelectedPayment(null);
    }
  };

  const handleAddPayment = (paymentData) => {
    toast({ title: "Success", description: "Payment added successfully (Demo)" });
    console.log("New Payment Data:", paymentData);
  };

  const handleApproveRequest = async (reqId) => {
    try {
        await approveJoinRequest(reqId);
        const [requests, students] = await Promise.all([
            getJoiningRequests(batch.id),
            getBatchStudents(batch.id)
        ]);
        setJoiningRequests(requests);
        setBatchStudents(students);
        toast({ title: "Success", description: "Request approved." });
    } catch (error) {
        toast({ title: "Error", description: "Failed to approve request.", variant: "destructive" });
    }
  };

  const handleRejectRequest = async (reqId) => {
    try {
        await rejectJoinRequest(reqId);
        const requests = await getJoiningRequests(batch.id);
        setJoiningRequests(requests);
        toast({ title: "Success", description: "Request rejected." });
    } catch (error) {
        toast({ title: "Error", description: "Failed to reject request.", variant: "destructive" });
    }
  };

  const handleDeleteStudent = async (enrollmentId) => {
    try {
      await removeStudent(enrollmentId);
      const students = await getBatchStudents(batch.id);
      setBatchStudents(students);
      toast({ title: "Success", description: "Student removed from batch." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove student.", variant: "destructive" });
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const message = formData.get('message');

    try {
      setIsCreatingNotification(true);
      await createNotification(batch.id, title, message);
      toast({ title: "Success", description: "Notification sent successfully." });
      const updatedNotifications = await getNotificationsForBatch(batch.id);
      setBatchNotifications(updatedNotifications || []);
      e.target.reset();
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to send notification", variant: "destructive" });
    } finally {
      setIsCreatingNotification(false);
    }
  };  const filteredBatchPayments = batchPayments.filter(payment => {
    if (userRole === 'student' && payment.studentId !== currentUser.id) {
      return false;
    }
    const matchesFilter = paymentFilter === 'all' || payment.status === paymentFilter;
    if (userRole === 'teacher') {
      const searchTerm = paymentSearch.toLowerCase();
      const studentName = getStudentName(payment.studentId).toLowerCase();
      const matchesSearch = !paymentSearch || studentName.includes(searchTerm);
      return matchesFilter && matchesSearch;
    }
    return matchesFilter;
  });

  return (
    <div>
      <Button onClick={onBack} variant="outline" className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

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
        <div className="md:hidden">
          <div className="flex overflow-x-auto space-x-1 p-2 bg-white rounded-lg border">
          {userRole === 'teacher' && (
            <Button variant={activeTab === 'students' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('students')} className="flex items-center space-x-2 whitespace-nowrap">
              <Users className="w-4 h-4" />
              <span>Students</span>
            </Button>
          )}
            <Button variant={activeTab === 'materials' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('materials')} className="flex items-center space-x-2 whitespace-nowrap">
              <FileText className="w-4 h-4" />
              <span>Materials</span>
            </Button>
            <Button variant={activeTab === 'attendance' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('attendance')} className="flex items-center space-x-2 whitespace-nowrap">
              <Calendar className="w-4 h-4" />
              <span>Attendance</span>
            </Button>
            <Button variant={activeTab === 'payments' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('payments')} className="flex items-center space-x-2 whitespace-nowrap">
              <CreditCard className="w-4 h-4" />
              <span>Payments</span>
            </Button>
            <Button variant={activeTab === 'notifications' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('notifications')} className="flex items-center space-x-2 whitespace-nowrap">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Button>
            {userRole === 'teacher' && (
              <Button variant={activeTab === 'joining-requests' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('joining-requests')} className="flex items-center space-x-2 whitespace-nowrap">
                <UserPlus className="w-4 h-4" />
                <span>Joining Requests</span>
              </Button>
            )}
          </div>
        </div>

        <TabsList className={`${styles.card} hidden md:grid w-full grid-cols-6`}>
          {userRole === 'teacher' && (
            <TabsTrigger value="students" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span>Students</span>
            </TabsTrigger>
          )}
          {userRole === 'teacher' && (
            <TabsTrigger value="joining-requests" className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <UserPlus className="w-4 h-4" />
              <span>Joining Requests</span>
            </TabsTrigger>
          )}
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

        {userRole === 'teacher' && (
          <TabsContent value="students" className="space-y-6">
                      {batchStudents.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No students enrolled"
              description="There are no students enrolled in this batch yet."
              action={userRole === 'teacher' && (
                <Button onClick={() => setShowAddStudent(true)} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              )}
            />
          ) : (
            <BatchStudents 
              batchId={batch.id}
              students={batchStudents}
              payments={batchPayments}
              userRole={userRole}
              onSendFeeNotification={sendFeeNotification}
              getPaymentStatusBadgeType={getPaymentStatusBadgeType}
              styles={styles}
              onDeleteStudent={handleDeleteStudent}
            />
          )}          </TabsContent>
        )}

        {userRole === 'teacher' && (
          <TabsContent value="joining-requests" className="space-y-6">
            <BatchJoiningRequests 
              requests={joiningRequests} 
              onApprove={handleApproveRequest} 
              onReject={handleRejectRequest} 
            />
          </TabsContent>
        )}

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
                  <Label htmlFor="file">Material File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setNewMaterial({...newMaterial, file: e.target.files[0]})}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleAddMaterial}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <LoadingSpinner className="w-4 h-4 mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Add Material
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddMaterial(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {batchMaterials.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No materials available"
              description="No study materials have been uploaded to this batch yet."
              action={userRole === 'teacher' && (
                <Button onClick={() => setShowAddMaterial(true)} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Material
                </Button>
              )}
            />
          ) : (
            <BatchMaterials 
              materials={batchMaterials}
              userRole={userRole}
              onDeleteMaterial={handleDeleteMaterial}
            />
          )}
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <h2 className="text-2xl font-bold">Attendance Records</h2>
          <BatchAttendance attendance={batchAttendance} getStudentName={getStudentName} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {userRole === 'teacher' && (
            <AddPaymentDialog students={batchStudents} batches={[batch]} onAddPayment={handleAddPayment} />
          )}
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
          {userRole === 'teacher' && (
          <Dialog open={showUpdatePayment} onOpenChange={setShowUpdatePayment}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Payment Status</DialogTitle>
                {selectedPayment && (
                  <DialogDescription>
                    Student: {getStudentName(selectedPayment.studentId)} | Amount: ${selectedPayment.amount}
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="flex flex-wrap gap-2 py-4">
                <Button onClick={() => handlePaymentStatusUpdate('paid')} className="bg-green-600 hover:bg-green-700">
                  Mark as Paid (Cash)
                </Button>
                <Button onClick={() => handlePaymentStatusUpdate('pending')} variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50">
                  Keep Pending
                </Button>
                <Button onClick={() => handlePaymentStatusUpdate('overdue')} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  Mark Overdue
                </Button>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowUpdatePayment(false)} variant="outline">
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {userRole === 'teacher' && (
            <Card>
              <CardHeader>
                <CardTitle>Create Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleCreateNotification}>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      placeholder="Enter notification title" 
                      required 
                      disabled={isCreatingNotification}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Enter notification message" 
                      required 
                      disabled={isCreatingNotification}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isCreatingNotification}
                  >
                    {isCreatingNotification ? (
                      <>
                        <LoadingSpinner className="w-4 h-4 mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Notification'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          {batchNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="No notifications have been sent in this batch yet."
              action={userRole === 'teacher' && (
                <Button onClick={() => setActiveTab('notifications')} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Notification
                </Button>
              )}
            />
          ) : (
            <BatchNotifications notifications={batchNotifications} userRole={userRole} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchDetails;