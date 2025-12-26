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
            LIST_BY_BATCH: (batchId) => `/api/teacher/batches/${batchId}/payments`,
            SUMMARY: '/api/teacher/payments/summary',
            STUDENTS_DUE: '/api/teacher/students/due-payments',
            BATCH_DUE: (batchId) => `/api/teacher/batch/${batchId}/due-payments`,
            STUDENT_PAYMENTS: (batchId) => `/api/teacher/student-payments/${batchId}`
        },
        STUDENT: {
            LIST: '/api/student/payments',
            SUMMARY: '/api/student/payments/summary',
            BATCH_STATUS: (batchId) => `/api/student/batch/${batchId}/payment-status`,
            DUE_PAYMENTS: (batchId) => `/api/student/batch/${batchId}/due-payments`,
            PAYMENT_OPTIONS: (batchId) => `/api/student/batch/${batchId}/payment-options`,
            PAYMENT_HISTORY: (batchId) => `/api/student/payment-history/${batchId}`
        },
        CASH: {
            MARK: '/api/payments/cash',
            MARK_ALT: (paymentId) => `/api/payments/${paymentId}/mark-cash`
        },
        ONLINE: {
            INITIATE: '/api/payments/online/initiate',
            CONFIRM: '/api/payments/online/confirm'
        },
        REMINDERS: {
            SEND: '/api/payments/reminders/send',
            HISTORY: '/api/payments/reminders/history'
        },
        CREATE: '/api/payments/create',
        UPDATE: (paymentId) => `/api/payments/${paymentId}`,
        DELETE: (paymentId) => `/api/payments/${paymentId}`,
        MARK_PAID: (paymentId) => `/api/payments/${paymentId}/mark-cash`,
        MARK_ONLINE: (paymentId) => `/api/payments/${paymentId}/mark-online`,
        MARK_PENDING: (paymentId) => `/api/payments/${paymentId}/mark-pending`,
        SETTLEMENT: {
            INSTANT: (paymentId) => `/api/payments/instant-settlement?payment_id=${paymentId}`,
            EXPRESS: (paymentId) => `/api/payments/express-settlement?payment_id=${paymentId}`
        }
    },
    SUBSCRIPTION: {
        CALCULATE: (batchId) => `/api/subscription/calculate/${batchId}`,
        PAY: '/api/subscription/pay',
        CALLBACK: '/api/subscription/callback',
        TEACHER: {
            STATUS: '/api/teacher/subscription/status',
            CREATE: '/api/teacher/subscription/create',
            PAYMENTS: '/api/teacher/subscription/payments',
            METRICS: '/api/teacher/subscription/metrics',
            SUBSCRIPTIONS: '/api/teacher/subscriptions',
            CALCULATE: '/api/teacher/subscription/calculate',
            INCREMENTAL: '/api/teacher/subscription/incremental',
            PAYMENT: '/api/teacher/subscription/payment',
            UNLOCK_MATERIALS: '/api/teacher/subscription/unlock-materials',
            STATUS_CHECK: '/api/teacher/subscription/status-check',
            CHECK_BATCH_CREATION: '/api/teacher/batch-creation-status',
            CHECK_MATERIAL_UPLOAD: (batchId) => `/api/batches/${batchId}/material-upload-status`,
            PAYMENT_STATUS: '/api/teacher/subscription-payment-status',
            MONTHLY_PAYMENT_STATUS: '/api/teacher/monthly-payment-status'
        }
    },
    RAZORPAY: {
        ACCOUNT: {
            GET: '/api/teacher/razorpay-account',
            CREATE: '/api/teacher/razorpay-account'
        }
    },
    MATERIALS: {
        DELETE: (materialId) => `/api/materials/${materialId}`,
        PRESIGNED_URL: (materialId) => `/api/materials/${materialId}/presigned-url`
    },
    KYC: {
        UPLOAD: '/api/teacher/kyc-upload',
        STATUS: '/api/teacher/kyc-status',
        ACCOUNT_STATUS: '/api/teacher/account-status'
    }
};

// Get base API URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
