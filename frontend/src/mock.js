// Mock data for Teacher-Student Management System

export const mockTeachers = [
  {
    id: 'T001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@school.com',
    phone: '+1234567890',
    password: 'teacher123',
    batches: ['B001', 'B002']
  },
  {
    id: 'T002',
    name: 'Prof. Michael Brown',
    email: 'michael.brown@school.com',
    phone: '+1234567891',
    password: 'teacher456',
    batches: ['B003', 'B004']
  }
];

export const mockStudents = [
  {
    id: 'S001',
    name: 'Emma Wilson',
    email: 'emma.wilson@student.com',
    phone: '+1234567892',
    password: 'student123',
    enrolledBatches: ['B001'],
    paymentStatus: 'paid'
  },
  {
    id: 'S002',
    name: 'James Davis',
    email: 'james.davis@student.com',
    phone: '+1234567893',
    password: 'student456',
    enrolledBatches: ['B001', 'B002'],
    paymentStatus: 'pending'
  },
  {
    id: 'S003',
    name: 'Sophia Miller',
    email: 'sophia.miller@student.com',
    phone: '+1234567894',
    password: 'student789',
    enrolledBatches: ['B003'],
    paymentStatus: 'paid'
  },
  {
    id: 'S004',
    name: 'Liam Garcia',
    email: 'liam.garcia@student.com',
    phone: '+1234567895',
    password: 'student101',
    enrolledBatches: ['B002', 'B004'],
    paymentStatus: 'overdue'
  }
];

export const mockBatches = [
  {
    id: 'B001',
    name: 'Mathematics Advanced',
    teacherId: 'T001',
    subject: 'Mathematics',
    schedule: 'Mon, Wed, Fri 10:00-11:30 AM',
    students: ['S001', 'S002'],
    startDate: '2024-01-15',
    endDate: '2024-06-15'
  },
  {
    id: 'B002',
    name: 'Physics Fundamentals',
    teacherId: 'T001',
    subject: 'Physics',
    schedule: 'Tue, Thu 2:00-3:30 PM',
    students: ['S002', 'S004'],
    startDate: '2024-02-01',
    endDate: '2024-07-01'
  },
  {
    id: 'B003',
    name: 'Chemistry Basics',
    teacherId: 'T002',
    subject: 'Chemistry',
    schedule: 'Mon, Wed 11:00-12:30 PM',
    students: ['S003'],
    startDate: '2024-01-20',
    endDate: '2024-06-20'
  },
  {
    id: 'B004',
    name: 'Biology Advanced',
    teacherId: 'T002',
    subject: 'Biology',
    schedule: 'Tue, Fri 3:00-4:30 PM',
    students: ['S004'],
    startDate: '2024-02-10',
    endDate: '2024-07-10'
  }
];

export const mockMaterials = [
  {
    id: 'M001',
    batchId: 'B001',
    title: 'Calculus Fundamentals',
    type: 'PDF',
    uploadDate: '2024-01-20',
    url: '#'
  },
  {
    id: 'M002',
    batchId: 'B001',
    title: 'Algebra Video Tutorial',
    type: 'Video',
    uploadDate: '2024-01-25',
    url: '#'
  },
  {
    id: 'M003',
    batchId: 'B002',
    title: 'Newton\'s Laws',
    type: 'PDF',
    uploadDate: '2024-02-05',
    url: '#'
  },
  {
    id: 'M004',
    batchId: 'B003',
    title: 'Periodic Table Guide',
    type: 'PDF',
    uploadDate: '2024-01-25',
    url: '#'
  }
];

export const mockAttendance = [
  {
    id: 'A001',
    batchId: 'B001',
    studentId: 'S001',
    date: '2024-01-22',
    status: 'present'
  },
  {
    id: 'A002',
    batchId: 'B001',
    studentId: 'S002',
    date: '2024-01-22',
    status: 'absent'
  },
  {
    id: 'A003',
    batchId: 'B002',
    studentId: 'S002',
    date: '2024-02-06',
    status: 'present'
  },
  {
    id: 'A004',
    batchId: 'B002',
    studentId: 'S004',
    date: '2024-02-06',
    status: 'present'
  }
];

export const mockNotifications = [
  {
    id: 'N001',
    batchId: 'B001',
    title: 'Assignment Deadline',
    message: 'Mathematics assignment due on Friday.',
    date: '2024-01-20',
    type: 'assignment'
  },
  {
    id: 'N002',
    batchId: 'B002',
    title: 'Class Rescheduled',
    message: 'Thursday class moved to 3:00 PM.',
    date: '2024-02-01',
    type: 'schedule'
  },
  {
    id: 'N003',
    batchId: 'B003',
    title: 'Lab Session',
    message: 'Chemistry lab session next Monday.',
    date: '2024-01-28',
    type: 'lab'
  }
];

export const mockPayments = [
  {
    id: 'P001',
    studentId: 'S001',
    batchId: 'B001',
    amount: 500,
    status: 'paid',
    dueDate: '2024-01-15',
    paidDate: '2024-01-10'
  },
  {
    id: 'P002',
    studentId: 'S002',
    batchId: 'B001',
    amount: 500,
    status: 'pending',
    dueDate: '2024-01-15',
    paidDate: null
  },
  {
    id: 'P003',
    studentId: 'S002',
    batchId: 'B002',
    amount: 600,
    status: 'pending',
    dueDate: '2024-02-01',
    paidDate: null
  },
  {
    id: 'P004',
    studentId: 'S004',
    batchId: 'B004',
    amount: 550,
    status: 'overdue',
    dueDate: '2024-02-10',
    paidDate: null
  }
];