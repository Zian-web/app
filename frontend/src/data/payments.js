// 💰 Payment Mock Data
// This file contains sample payment data for development
// TODO: Replace with real API calls when backend is connected

export const mockPayments = [
  { id: 'P001', studentId: 'S001', batchId: 'B002', amount: 1200, status: 'paid', paidDate: '2024-07-15T10:00:00.000Z', dueDate: '2024-07-15T10:00:00.000Z', paymentMethod: 'cash' },
  { id: 'P002', studentId: 'S002', batchId: 'B003', amount: 1100, status: 'paid', paidDate: '2024-08-14T10:00:00.000Z', dueDate: '2024-08-14T10:00:00.000Z', paymentMethod: 'cash' },
  { id: 'P003', studentId: 'S003', batchId: 'B004', amount: 1300, status: 'paid', paidDate: '2024-09-20T10:00:00.000Z', dueDate: '2024-09-20T10:00:00.000Z', paymentMethod: 'online' },
  { id: 'P004', studentId: 'S004', batchId: 'B005', amount: 1400, status: 'paid', paidDate: '2024-10-20T10:00:00.000Z', dueDate: '2024-10-20T10:00:00.000Z', paymentMethod: 'cash' },
  { id: 'P005', studentId: 'S005', batchId: 'B006', amount: 1500, status: 'paid', paidDate: '2024-11-12T10:00:00.000Z', dueDate: '2024-11-12T10:00:00.000Z', paymentMethod: 'online' },
  { id: 'P006', studentId: 'S001', batchId: 'B002', amount: 1250, status: 'paid', paidDate: '2024-12-10T10:00:00.000Z', dueDate: '2024-12-10T10:00:00.000Z', paymentMethod: 'cash' },
  { id: 'P007', studentId: 'S002', batchId: 'B003', amount: 1350, status: 'paid', paidDate: '2025-01-18T10:00:00.000Z', dueDate: '2025-01-18T10:00:00.000Z', paymentMethod: 'online' },
  { id: 'P008', studentId: 'S003', batchId: 'B004', amount: 1450, status: 'paid', paidDate: '2025-02-15T10:00:00.000Z', dueDate: '2025-02-15T10:00:00.000Z', paymentMethod: 'cash' },
  { id: 'P009', studentId: 'S004', batchId: 'B005', amount: 1550, status: 'paid', paidDate: '2025-03-12T10:00:00.000Z', dueDate: '2025-03-12T10:00:00.000Z', paymentMethod: 'online' },
  { id: 'P010', studentId: 'S005', batchId: 'B006', amount: 1600, status: 'paid', paidDate: '2025-04-10T10:00:00.000Z', dueDate: '2025-04-10T10:00:00.000Z', paymentMethod: 'cash' },
  // Add some pending and overdue payments for testing
  { id: 'P011', studentId: 'S001', batchId: 'B002', amount: 1700, status: 'pending', paidDate: null, dueDate: '2025-10-05T10:00:00.000Z', paymentMethod: 'online' },
  { id: 'P012', studentId: 'S002', batchId: 'B003', amount: 1800, status: 'overdue', paidDate: null, dueDate: '2025-08-01T10:00:00.000Z', paymentMethod: 'cash' }
];

// Payment statuses: 'paid', 'pending', 'overdue', 'cancelled'
// Payment methods: 'cash', 'online', 'bank_transfer', 'upi'
