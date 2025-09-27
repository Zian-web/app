import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ResponsiveLayout from '../ResponsiveLayout';
import BatchDetails from '../BatchDetails';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard,
  Bell
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { 
  mockBatches, 
  mockStudents, 
  mockMaterials, 
  mockAttendance, 
  mockNotifications, 
  mockPayments 
} from '../../data';
import TeacherDashboardOverview from './TeacherDashboardOverview';
import TeacherBatches from './TeacherBatches';
import TeacherStudents from './TeacherStudents';
import TeacherMaterials from './TeacherMaterials';
import TeacherAttendance from './TeacherAttendance';
import TeacherPayments from './TeacherPayments';
import TeacherNotifications from './TeacherNotifications';
import PaymentSummary from '../PaymentSummary';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'paid', 'pending'
  const [paymentSearch, setPaymentSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const { toast } = useToast();

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

  // Filter materials based on search
  const filteredMaterials = teacherMaterials.filter(material => {
    const searchTerm = materialSearch.toLowerCase();
    return !materialSearch || 
      material.title.toLowerCase().includes(searchTerm) || 
      getBatchName(material.batchId).toLowerCase().includes(searchTerm) ||
      material.type.toLowerCase().includes(searchTerm);
  });

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

  // Filter payments based on status and search
  const filteredPayments = teacherPayments.filter(payment => {
    let matchesFilter;
    if (paymentFilter === 'all') {
      matchesFilter = true;
    } else if (paymentFilter === 'pending') {
      matchesFilter = payment.status === 'pending' || payment.status === 'overdue';
    } else {
      matchesFilter = payment.status === paymentFilter;
    }

    const searchTerm = paymentSearch.toLowerCase();
    const studentName = getStudentName(payment.studentId).toLowerCase();
    const batchName = getBatchName(payment.batchId).toLowerCase();
    const matchesSearch = !paymentSearch || 
      studentName.includes(searchTerm) || 
      batchName.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Function to alert students with pending payments
  const alertPendingPayments = () => {
    const pendingPayments = teacherPayments.filter(payment => payment.status === 'pending' || payment.status === 'overdue');
    const pendingStudents = pendingPayments.map(payment => getStudentName(payment.studentId));
    
    if (pendingStudents.length === 0) {
      toast({
        title: "No Due Payments",
        description: "All students are up to date with their payments.",
        variant: "default"
      });
      return;
    }

    toast({
      title: "Payment Reminders Sent",
      description: `Payment reminders sent to ${pendingStudents.length} students.`,
      variant: "default"
    });

    // Here you would typically call an API to send actual notifications
    console.log("Payment reminders to be sent to:", pendingStudents);
  };

  const getPaymentSummary = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const prevYear = thisYear - 1;

    const thisMonthPayments = teacherPayments.filter(p => {
      const paidDate = new Date(p.paidDate);
      return p.status === 'paid' && paidDate.getMonth() === thisMonth && paidDate.getFullYear() === thisYear;
    });

    const thisMonthTotal = thisMonthPayments.reduce((acc, p) => acc + p.amount, 0);

    const thisMonthCashTotal = thisMonthPayments
      .filter(p => p.paymentMethod === 'cash')
      .reduce((acc, p) => acc + p.amount, 0);

    const thisMonthOnlineTotal = thisMonthPayments
      .filter(p => p.paymentMethod === 'online')
      .reduce((acc, p) => acc + p.amount, 0);

    const prevYearTotal = teacherPayments
      .filter(p => {
        const paidDate = new Date(p.paidDate);
        return p.status === 'paid' && paidDate.getFullYear() === prevYear;
      })
      .reduce((acc, p) => acc + p.amount, 0);

    const batchTotals = teacherBatches.map(batch => ({
      id: batch.id,
      name: batch.name,
      total: teacherPayments
        .filter(p => p.batchId === batch.id && p.status === 'paid')
        .reduce((acc, p) => acc + p.amount, 0)
    }));

    const topBatch = batchTotals.reduce((prev, current) => (prev.total > current.total) ? prev : current, { name: 'N/A', total: 0 });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(thisYear, i).toLocaleString('default', { month: 'short' }),
      total: 0
    }));

    teacherPayments.forEach(p => {
      if (p.status === 'paid') {
        const paidDate = new Date(p.paidDate);
        if (paidDate.getFullYear() === thisYear) {
          const month = paidDate.getMonth();
          monthlyData[month].total += p.amount;
        }
      }
    });

    return { thisMonthTotal, prevYearTotal, topBatch, monthlyData, batchData: batchTotals, thisMonthCashTotal, thisMonthOnlineTotal };
  };

  const paymentSummary = getPaymentSummary();

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'batches', label: 'Batches', icon: <Users className="w-4 h-4" /> },
    { value: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { value: 'materials', label: 'Materials', icon: <FileText className="w-4 h-4" /> },
    { value: 'attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> },
    { value: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
  ];

  if (selectedBatch) {
    return (
      <BatchDetails 
        batch={selectedBatch}
        onBack={() => setSelectedBatch(null)}
        userRole="teacher"
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
      userRole="teacher"
    >
      {activeTab === 'dashboard' && (
        <TeacherDashboardOverview
          batches={teacherBatches}
          students={teacherStudents}
          materials={teacherMaterials}
          notifications={teacherNotifications}
          onSelectBatch={setSelectedBatch}
        />
      )}

      {activeTab === 'batches' && (
        <TeacherBatches batches={teacherBatches} onSelectBatch={setSelectedBatch} />
      )}

      {activeTab === 'students' && (
        <TeacherStudents students={teacherStudents} batchIds={batchIds} getPaymentStatusColor={getPaymentStatusColor} />
      )}

      {activeTab === 'materials' && (
        <TeacherMaterials 
          materials={filteredMaterials}
          getBatchName={getBatchName}
          materialSearch={materialSearch}
          onSearchChange={(e) => setMaterialSearch(e.target.value)}
        />
      )}

      {activeTab === 'attendance' && (
        <TeacherAttendance 
          attendance={teacherAttendance}
          getBatchName={getBatchName}
          getStudentName={getStudentName}
        />
      )}

      {activeTab === 'payments' && (
        <>
          <PaymentSummary {...paymentSummary} />
          <TeacherPayments
            payments={filteredPayments}
            getStudentName={getStudentName}
            getBatchName={getBatchName}
            getPaymentStatusColor={getPaymentStatusColor}
            paymentFilter={paymentFilter}
            onFilterChange={setPaymentFilter}
            paymentSearch={paymentSearch}
            onSearchChange={(e) => setPaymentSearch(e.target.value)}
            onAlertPending={alertPendingPayments}
          />
        </>
      )}

      {activeTab === 'notifications' && (
        <TeacherNotifications notifications={teacherNotifications} getBatchName={getBatchName} />
      )}
    </ResponsiveLayout>
  );
};

export default TeacherDashboard;
