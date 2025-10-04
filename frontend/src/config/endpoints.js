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
        GENERATE_CODE: (id) => `/api/batches/${id}/generate-join-code`, // Corrected
        INCREASE_LIMIT: (id) => `/api/batches/${id}/limit`, // Corrected
        JOIN: '/api/student/batches/join', // Corrected
        STUDENT: {
            LIST: '/api/student/batches/' // Corrected
        },
        MATERIALS: {
            LIST: (batchId) => `/api/batches/${batchId}/materials/`,
            CREATE: (batchId) => `/api/batches/${batchId}/materials/`
        },
        STUDENTS: {
            LIST: (batchId) => `/api/batches/${batchId}/students`,
            TOGGLE_ACCESS: (batchId, studentId) => `/api/batches/${batchId}/students/${studentId}/toggle-material-access`,
            REMOVE: (enrollmentId) => `/api/enrollments/${enrollmentId}`
        },
        PAYMENTS: {
            LIST: (batchId) => `/api/batches/${batchId}/payments/`
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
    },
    MATERIALS: {
        DELETE: (materialId) => `/api/materials/${materialId}`
    },
    // Kept for compatibility, though BATCH.STUDENTS is more organized
    ENROLLMENTS: {
        TOGGLE_ACCESS: (enrollmentId) => `/api/enrollments/${enrollmentId}/toggle-material-access`,
        REMOVE: (enrollmentId) => `/api/enrollments/${enrollmentId}`
    }
};

// Get base API URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
