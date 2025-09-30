// 🔧 Environment Configuration
// This file contains all environment variables and configuration

const config = {
  // Backend API URL
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  // App Configuration
  APP_NAME: process.env.REACT_APP_APP_NAME || 'LMS',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Development Settings
  DEBUG: process.env.REACT_APP_DEBUG === 'true' || true,
  MOCK_DATA: process.env.REACT_APP_MOCK_DATA === 'true' || true,
  
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
      STUDENTS: (id) => `/batches/${id}/students`,
      MATERIALS: (id) => `/batches/${id}/materials`
    }
  }
};

export default config;
