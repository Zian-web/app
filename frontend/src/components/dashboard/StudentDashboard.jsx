import React, { useState, useEffect } from 'react';
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
  Settings,
  User
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { getStudentBatches, getBatchMaterials, getNotificationsForBatch } from '../../lib/api';
import StudentDashboardOverview from '../student/StudentDashboardOverview';
import StudentBatches from '../student/StudentBatches';
import StudentMaterials from '../student/StudentMaterials';
import StudentAttendance from '../student/StudentAttendance';
import StudentPayments from '../student/StudentPayments';
import StudentNotifications from '../student/StudentNotifications';
import StudentSettings from '../student/StudentSettings';
import StudentProfile from '../student/StudentProfile';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const { toast } = useToast();

  const [studentBatches, setStudentBatches] = useState([]);
  const [studentMaterials, setStudentMaterials] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [studentNotifications, setStudentNotifications] = useState([]);
  const [studentPayments, setStudentPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        return;
      }
      
      setIsLoading(true);
      try {
        const batches = await getStudentBatches();
        const validBatches = Array.isArray(batches) ? batches : [];
        setStudentBatches(validBatches);

        if (validBatches.length > 0) {
          const materialsPromises = validBatches.map(batch => getBatchMaterials(batch.id));
          const materials = await Promise.all(materialsPromises);
          const materialsWithBatchInfo = validBatches.flatMap((batch, batchIndex) => {
            const batchMaterials = materials[batchIndex] || [];
            return batchMaterials.map(material => ({
              ...material,
              batchName: batch.name,
              teacherName: batch.teacher?.name,
            }));
          });
          setStudentMaterials(materialsWithBatchInfo);

          const notificationsPromises = validBatches.map(batch => getNotificationsForBatch(batch.id));
          const notifications = await Promise.all(notificationsPromises);
          const notificationsWithBatchInfo = validBatches.flatMap((batch, batchIndex) => {
            const batchNotifications = notifications[batchIndex] || [];
            return batchNotifications.map(notification => ({
              ...notification,
              batchName: batch.name,
              teacherName: batch.teacher?.name,
            }));
          });
          
          // Sort notifications by date and get the top 4
          const sortedNotifications = notificationsWithBatchInfo.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setStudentNotifications(sortedNotifications);

        } else {
          setStudentMaterials([]);
          setStudentNotifications([]);
        }

      } catch (error) {
        console.error('Error fetching student data:', error);
        toast({ 
          title: "Error Fetching Data", 
          description: "There was a problem loading your dashboard. Please try logging in again.", 
          variant: "destructive" 
        });
        setStudentBatches([]);
        setStudentMaterials([]);
        setStudentNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'batches', label: 'All Batches', icon: <Users className="w-4 h-4" /> },
    { value: 'materials', label: 'Study Material', icon: <FileText className="w-4 h-4" /> },
    { value: 'attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> },
    { value: 'payments', label: 'Pending Payment', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { value: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { value: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (selectedBatch) {
    return (
      <BatchDetails 
        batch={selectedBatch}
        onBack={() => setSelectedBatch(null)}
        userRole={user?.type}
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
      userName={user?.full_name || 'Student'}
      userRole={user?.type}
    >
      {activeTab === 'dashboard' && (
        <StudentDashboardOverview
          batches={studentBatches || []}
          materials={studentMaterials || []}
          notifications={studentNotifications.slice(0, 4) || []}
          onSelectBatch={setSelectedBatch}
          attendanceRate={85}
          pendingPayments={2}
        />
      )}

      {activeTab === 'batches' && (
        <StudentBatches
          batches={studentBatches}
          onSelectBatch={setSelectedBatch}
        />
      )}

      {activeTab === 'materials' && (
        <StudentMaterials 
          materials={studentMaterials}
        />
      )}

      {activeTab === 'attendance' && (
        <StudentAttendance 
          attendance={studentAttendance}
        />
      )}

      {activeTab === 'payments' && (
        <StudentPayments
          payments={studentPayments}
        />
      )}

      {activeTab === 'notifications' && (
        <StudentNotifications notifications={studentNotifications} />
      )}

      {activeTab === 'profile' && (
        <StudentProfile />
      )}

      {activeTab === 'settings' && (
        <StudentSettings />
      )}
    </ResponsiveLayout>
  );
};

export default StudentDashboard;