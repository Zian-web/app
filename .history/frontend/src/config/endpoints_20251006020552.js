// Centralized API endpoints configuration
export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/login',
        REGISTER_TEACHER: '/api/teacher/register',
        REGISTER_STUDENT: '/api/student/register',
    },
    USERS: {
        ME: '/api/users/me',
    },
    BATCH: {
        LIST: '/api/batches/',
        CREATE: '/api/batches/',
        DELETE: (id) => `/api/batches/${id}`,
        UPDATE: (id) => `/api/batches/${id}`,
        DETAILS: (id) => `/api/batches/${id}`,
        GENERATE_CODE: (id) => `/api/batches/${id}/generate-join-code`,
        JOIN: '/api/student/batches/join',
        STUDENT: {
            LIST: '/api/student/batches/'
        },
        MATERIALS: {
            LIST: (batchId) => `/api/batches/${batchId}/materials/`,
            CREATE: (batchId) => `/api/batches/${batchId}/materials/`
        },
        STUDENTS: {
            LIST: (batchId) => `/api/batches/${batchId}/students`,
            TOGGLE_ACCESS: (batchId, studentId) => `/api/batches/${batchId}/students/${studentId}/toggle-material-access`,
            REMOVE: (batchId, studentId) => `/api/batches/${batchId}/students/${studentId}`,
        },
        JOINING_REQUESTS: {
            LIST: (batchId) => `/api/batches/${batchId}/joining-requests`,
            APPROVE: (reqId) => `/api/joining-requests/${reqId}/approve`,
            REJECT: (reqId) => `/api/joining-requests/${reqId}/reject`
        },
        NOTIFICATIONS: {
            LIST: (batchId) => `/api/batches/${batchId}/notifications`,
            CREATE: (batchId) => `/api/batches/${batchId}/notifications`
        },
        PAYMENTS: {
            LIST: (batchId) => `/api/batches/${batchId}/payments`
        },
    },
    PAYMENTS: {
        TEACHER: {
            LIST: '/api/teacher/payments',
            SUMMARY: '/api/teacher/payments/summary'
        },
        STUDENT: {
            LIST: '/api/student/payments',
            SUMMARY: '/api/student/payments/summary',
            BATCH_STATUS: (batchId) => `/api/student/batch/${batchId}/payment-status`
        },
        CASH: {
            MARK: '/api/payments/cash',
            MARK_ALT: (paymentId) => `/api/payments/${paymentId}/mark-cash`
        },
        ONLINE: {
            INITIATE: '/api/payments/online/initiate'
        },
        REMINDERS: {
            SEND: '/api/payments/reminders/send'
        },
        CREATE: '/api/payments/create'
    },
    MATERIALS: {
        DELETE: (materialId) => `/api/materials/${materialId}`,
        PRESIGNED_URL: (materialId) => `/api/materials/${materialId}/presigned-url`
    }
};

// Get base API URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
