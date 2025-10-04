// 🔧 Environment Configuration
// This file contains all environment variables and configuration

const config = {
  // Backend API URL
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'LMS',
  VERSION: import.meta.env.VITE_VERSION || '1.0.0',
  
  // Development Settings
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || true,
  MOCK_DATA: import.meta.env.VITE_MOCK_DATA === 'true' || true,
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    },
    STUDENTS: {
      BASE: '/students',
      BY_ID: (id) => `/students/${id}`,
      BATCHES: (id) => `/students/${id}/batches`,
      ATTENDANCE: (id) => `/students/${id}/attendance`,
      PAYMENTS: (id) => `/students/${id}/payments`
    },
    TEACHERS: {
      BASE: '/teachers',
      BY_ID: (id) => `/teachers/${id}`,
      BATCHES: (id) => `/teachers/${id}/batches`,
      STUDENTS: (id) => `/teachers/${id}/students`
    },
    BATCHES: {
      BASE: '/batches',
      BY_ID: (id) => `/batches/${id}`,
      JOIN: '/batches/join',
      STUDENTS: (id) => `/batches/${id}/students`,
      MATERIALS: (id) => `/batches/${id}/materials`,
      NOTIFICATIONS: (id) => `/batches/${id}/notifications`,
      JOIN_CODE: (id) => `/batches/${id}/generate-join-code`,
      INCREASE_LIMIT: (id) => `/batches/${id}/increase-limit`,
      JOINING_REQUESTS: (id) => `/batches/${id}/joining-requests`,
    },
    STUDENT_NOTIFICATIONS: '/student/notifications'
  }
};

export default config;
