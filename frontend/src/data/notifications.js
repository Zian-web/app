// 🔔 Notifications Mock Data
// This file contains sample notification data for development
// TODO: Replace with real API calls when backend is connected

export const mockNotifications = [
  {
    id: 'N001',
    userId: 'S001',
    message: 'Welcome to the course! Your batch starts tomorrow.',
    timestamp: '2024-01-15T10:00:00.000Z',
    read: false,
    type: 'welcome'
  },
  {
    id: 'N002',
    userId: 'S001',
    message: 'New study material uploaded for Mathematics.',
    timestamp: '2024-01-16T14:00:00.000Z',
    read: false,
    type: 'material'
  },
  {
    id: 'N003',
    userId: 'S001',
    message: 'Payment due for this month. Please pay before the due date.',
    timestamp: '2024-01-17T16:00:00.000Z',
    read: true,
    type: 'payment'
  },
  {
    id: 'N004',
    userId: 'T001',
    message: 'New student enrolled in your batch.',
    timestamp: '2024-01-18T09:00:00.000Z',
    read: false,
    type: 'enrollment'
  }
];

// Notification types: 'welcome', 'material', 'payment', 'attendance', 'enrollment', 'general'
