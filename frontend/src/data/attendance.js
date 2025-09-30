// 📅 Attendance Mock Data
// This file contains sample attendance data for development
// TODO: Replace with real API calls when backend is connected

export const mockAttendance = [
  { id: 'A001', batchId: 'B002', studentId: 'S001', date: '2024-01-15T10:00:00.000Z', status: 'present' },
  { id: 'A002', batchId: 'B002', studentId: 'S001', date: '2024-01-17T10:00:00.000Z', status: 'present' },
  { id: 'A003', batchId: 'B002', studentId: 'S001', date: '2024-01-19T10:00:00.000Z', status: 'absent' },
  { id: 'A004', batchId: 'B003', studentId: 'S002', date: '2024-01-16T14:00:00.000Z', status: 'present' },
  { id: 'A005', batchId: 'B003', studentId: 'S002', date: '2024-01-18T14:00:00.000Z', status: 'present' },
  { id: 'A006', batchId: 'B003', studentId: 'S002', date: '2024-01-20T14:00:00.000Z', status: 'late' }
];

// Attendance statuses: 'present', 'absent', 'late', 'excused'
