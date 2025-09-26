// Development mock data
export const mockTeachers = [{
  id: 'T001',
  name: 'Sample Teacher',
  email: 'teacher@example.com',
  password: 'password',
  batches: ['B001']
}];

export const mockStudents = [{
  id: 'S001',
  name: 'Sample Student',
  email: 'student@example.com',
  password: 'password',
  enrolledBatches: ['B001']
}];

export const mockBatches = [{
  id: 'B001',
  name: 'Sample Batch',
  subject: 'Mathematics',
  schedule: 'Mon, Wed 10:00 AM',
  teacherId: 'T001',
  students: ['S001']
}];

export const mockMaterials = [{
  id: 'M001',
  batchId: 'B001',
  title: 'Sample Material',
  description: 'Sample study material',
  uploadDate: new Date().toISOString(),
  fileUrl: '#'
}];

export const mockAttendance = [{
  id: 'A001',
  batchId: 'B001',
  studentId: 'S001',
  date: new Date().toISOString(),
  status: 'present'
}];

export const mockNotifications = [{
  id: 'N001',
  userId: 'S001',
  message: 'Welcome to the course!',
  timestamp: new Date().toISOString(),
  read: false
}];

export const mockPayments = [{
  id: 'P001',
  studentId: 'S001',
  amount: 1000,
  date: new Date().toISOString(),
  status: 'paid',
  batchId: 'B001'
}];

export const mockAssignments = [{
  id: 'AS001',
  batchId: 'B001',
  title: 'Sample Assignment',
  description: 'Please complete this assignment',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  maxScore: 100
}];

export const mockSubmissions = [{
  id: 'SU001',
  assignmentId: 'AS001',
  studentId: 'S001',
  submissionDate: new Date().toISOString(),
  score: null,
  status: 'submitted'
}];