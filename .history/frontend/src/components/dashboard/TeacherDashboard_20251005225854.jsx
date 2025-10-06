import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ResponsiveLayout from '../layout/ResponsiveLayout';
import BatchDetails from '../shared/BatchDetails';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard,
  Bell,
  Settings
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { teacherService } from '../../services/teacherService';
import { getMyBatches, getBatchMaterials, createBatch, deleteBatch, getNotificationsForBatch, getBatchStudents } from '../../lib/api';
import TeacherDashboardOverview from '../teacher/TeacherDashboardOverview';
import TeacherBatches from '../teacher/TeacherBatches';
import TeacherStudents from '../teacher/TeacherStudents';
import TeacherMaterials from '../teacher/TeacherMaterials';
import TeacherAttendance from '../teacher/TeacherAttendance';
import TeacherPayments from '../teacher/TeacherPayments';
import TeacherNotifications from '../teacher/TeacherNotifications';
import TeacherSettings from '../teacher/TeacherSettings';
import TeacherSubscription from '../teacher/TeacherSubscription';
import PaymentSummary from '../shared/PaymentSummary';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'paid', 'pending'
  const [paymentSearch, setPaymentSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const { toast } = useToast();

  const [teacherBatches, setTeacherBatches] = useState([]);
  const [teacherStudents, setTeacherStudents] = useState([]);
  const [teacherMaterials, setTeacherMaterials] = useState([]);
  const [teacherAttendance, setTeacherAttendance] = useState([]);
  const [teacherNotifications, setTeacherNotifications] = useState([]);
  const [teacherPayments, setTeacherPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const batches = await getMyBatches();
      const validBatches = Array.isArray(batches) ? batches : [];
      setTeacherBatches(validBatches);

      const allMaterials = [];
      const allNotifications = [];

      for (const batch of validBatches) {
        try {
          const batchMaterials = await getBatchMaterials(batch.id);
          if (batchMaterials) {
            allMaterials.push(...batchMaterials);
          }
        } catch (err) {
          console.error(`Failed to fetch materials for batch ${batch.id}:`, err);
          toast({
            title: `Materials Error for Batch: ${batch.name}`,
            description: err.message || "Could not fetch materials.",
            variant: "destructive",
          });
        }

        try {
          const batchNotifications = await getNotificationsForBatch(batch.id);
          if (batchNotifications) {
            const notificationsWithBatchName = batchNotifications.map(n => ({ ...n, batchName: batch.name }));
            allNotifications.push(...notificationsWithBatchName);
          }
        } catch (err) {
          console.error(`Failed to fetch notifications for batch ${batch.id}:`, err);
          toast({
            title: `Notifications Error for Batch: ${batch.name}`,
            description: err.message || "Could not fetch notifications.",
            variant: "destructive",
          });
        }
      }
      setTeacherMaterials(allMaterials);
      setTeacherNotifications(allNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

      const allStudents = [];
      for (const batch of validBatches) {
        try {
          const batchStudents = await getBatchStudents(batch.id);
          if (batchStudents) {
            const studentsWithBatchInfo = batchStudents.map(student => ({
              ...student,
              batch_id: batch.id,
              batch_name: batch.name
            }));
            allStudents.push(...studentsWithBatchInfo);
          }
        } catch (err) {
          console.error(`Failed to fetch students for batch ${batch.id}:`, err);
          toast({
            title: `Students Error for Batch: ${batch.name}`,
            description: err.message || "Could not fetch students.",
            variant: "destructive",
          });
        }
      }
      setTeacherStudents(allStudents);

    } catch (error) {
      console.error('Error fetching main data:', error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch your batches. Please try again.", 
        variant: "destructive" 
      });
      setTeacherBatches([]);
      setTeacherMaterials([]);
      setTeacherStudents([]);
      setTeacherNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemoveStudent = async (batchId, studentId) => {
    try {
      await teacherService.removeStudentFromBatch(batchId, studentId);
      setTeacherStudents(prevStudents => prevStudents.filter(s => !(s.id === studentId && s.batch_id === batchId)));
      toast({
        title: "Success",
        description: `Student has been removed from the batch.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to remove student: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const getBatchName = (batchId) => {
    const batch = teacherBatches.find(b => b.id === batchId);
    return batch ? batch.name : 'Unknown Batch';
  };

  const handleAddBatch = async (newBatch) => {
    try {
      const addedBatch = await createBatch(newBatch);
      setTeacherBatches(prevBatches => [...prevBatches, addedBatch]);
      toast({
        title: "Success",
        description: `${addedBatch.name} batch has been created successfully.`,
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add batch.", variant: "destructive" });
    }
  };

  const handleBatchDelete = async (batchId) => {
    try {
      await deleteBatch(batchId);
      setTeacherBatches(prev => prev.filter(batch => batch.id !== batchId));
      setTeacherMaterials(prev => prev.filter(material => material.batch_id !== batchId));
      toast({ title: "Success", description: "Batch deleted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete batch.", variant: "destructive" });
    }
  };

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'batches', label: 'Batches', icon: <Users className="w-4 h-4" /> },
    { value: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { value: 'materials', label: 'Materials', icon: <FileText className="w-4 h-4" /> },
    { value: 'attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> },
    { value: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { value: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const batchesWithStudentCounts = teacherBatches.map(batch => {
    const count = teacherStudents.filter(student => student.batch_id === batch.id).length;
    return {
      ...batch,
      approved_student_count: count
    };
  });

  if (isLoading) {
    return <div>Loading...</div>;
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
      {selectedBatch ? (
        <BatchDetails 
          batch={selectedBatch}
          onBack={() => setSelectedBatch(null)}
          userRole="teacher"
          currentUser={user}
        />
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <TeacherDashboardOverview
              batches={teacherBatches || []}
              students={teacherStudents || []}
              materials={teacherMaterials || []}
              notifications={teacherNotifications || []}
              onSelectBatch={setSelectedBatch}
              paymentSummary={{}}
            />
          )}

          {activeTab === 'batches' && (
                    <TeacherBatches
                      batches={batchesWithStudentCounts}
                      onSelectBatch={setSelectedBatch}
                      onAddBatch={handleAddBatch}
                      onBatchDelete={handleBatchDelete}
                      onDataRefresh={fetchData}
                    />          )}

          {activeTab === 'students' && (
            <TeacherStudents students={teacherStudents} batchIds={teacherBatches.map(b => b.id)} getPaymentStatusColor={() => ''} onDeleteStudent={handleRemoveStudent} />
          )}

          {activeTab === 'materials' && (
            <TeacherMaterials 
              materials={teacherMaterials}
              getBatchName={getBatchName}
              materialSearch={materialSearch}
              onSearchChange={(e) => setMaterialSearch(e.target.value)}
            />
          )}

          {activeTab === 'attendance' && (
            <TeacherAttendance 
              attendance={teacherAttendance}
              getBatchName={getBatchName}
              getStudentName={() => ''}
            />
          )}

          {activeTab === 'payments' && (
            <TeacherPayments />
          )}

          {activeTab === 'notifications' && (
            <TeacherNotifications 
              notifications={teacherNotifications} 
              getBatchName={getBatchName} 
              batches={teacherBatches}
              onDataRefresh={fetchData}
            />
          )}

          {activeTab === 'settings' && (
            <TeacherSettings />
          )}
        </>
      )}
    </ResponsiveLayout>
  );
};

export default TeacherDashboard;