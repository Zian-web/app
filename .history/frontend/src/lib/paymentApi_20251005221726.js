// Payment API endpoints and functions
import { API_BASE_URL, ENDPOINTS } from "../config/endpoints";

const API_KEY = import.meta.env.VITE_API_KEY;

const getAuthToken = () => localStorage.getItem("authToken");

// Central request handler
const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`.replace(/([^:])\/\/+/g, "$1/");

    const headers = {
        "X-API-Key": API_KEY,
        ...options.headers,
    };

    const token = getAuthToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body instanceof FormData) {
        delete headers["Content-Type"];
    } else if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 204) {
            return null;
        }

        const responseData = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("authToken");
                window.location.href = "/login";
                throw new Error("Session expired. Please log in again.");
            }
            const errorMessage = responseData.detail || JSON.stringify(responseData);
            throw new Error(errorMessage);
        }
        return responseData;
    } catch (error) {
        console.error(`API request to ${url} failed:`, error);
        throw error;
    }
};

// --- Payment Management API ---

// Teacher Payment Dashboard
export const getTeacherPayments = () => request('/api/teacher/payments');
export const getTeacherPaymentSummary = () => request('/api/teacher/payments/summary');
export const getTeacherPaymentAnalytics = (timeRange = '30d') => 
    request(`/api/teacher/payments/analytics?time_range=${timeRange}`);

// Student Payment Interface
export const getStudentPayments = () => request('/api/student/payments');
export const getStudentPaymentSummary = () => request('/api/student/payments/summary');
export const getStudentBatchPaymentStatus = (batchId) => 
    request(`/api/student/batch/${batchId}/payment-status`);

// Payment Processing
export const initiateOnlinePayment = (paymentData) => {
    return request('/api/payments/online/initiate', {
        method: 'POST',
        body: JSON.stringify(paymentData)
    });
};

export const verifyOnlinePayment = (verificationData) => {
    return request('/api/payments/online/verify', {
        method: 'POST',
        body: JSON.stringify(verificationData)
    });
};

export const createCashPayment = (paymentData) => {
    return request('/api/payments/cash', {
        method: 'POST',
        body: JSON.stringify(paymentData)
    });
};

// Batch-wise Payment Management
export const getBatchPayments = (batchId) => request(`/api/batches/${batchId}/payments`);
export const getBatchPaymentSummary = (batchId) => request(`/api/batches/${batchId}/payments/summary`);
export const getBatchPaymentAnalytics = (batchId, timeRange = '30d') => 
    request(`/api/batches/${batchId}/payments/analytics?time_range=${timeRange}`);

// --- Subscription Management API ---

// Teacher Subscription
export const getTeacherSubscriptionStatus = () => request('/api/teacher/subscription/status');
export const calculateSubscriptionFee = (subscriptionData) => {
    return request('/api/teacher/subscription/calculate', {
        method: 'POST',
        body: JSON.stringify(subscriptionData)
    });
};

export const createTeacherSubscription = (plan = 'basic') => {
    return request('/api/teacher/subscription/create', {
        method: 'POST',
        body: JSON.stringify({ plan })
    });
};

export const getTeacherSubscriptionMetrics = () => request('/api/teacher/subscription/metrics');
export const getTeacherSubscriptionPayments = () => request('/api/teacher/subscription/payments');

export const processSubscriptionPayment = (subscriptionId) => {
    return request('/api/teacher/subscription/payment', {
        method: 'POST',
        body: JSON.stringify({ subscription_id: subscriptionId })
    });
};

export const calculateIncrementalSubscription = (incrementalData) => {
    return request('/api/teacher/subscription/incremental', {
        method: 'POST',
        body: JSON.stringify(incrementalData)
    });
};

// Subscription Status Check
export const checkSubscriptionStatus = () => request('/api/teacher/subscription/status-check');
export const checkMaterialAccess = (materialId) => request(`/api/teacher/materials/check-access/${materialId}`);

// --- Payment Reminder System API ---

// Reminder Management
export const getOverdueStudents = (batchId = null) => {
    const endpoint = batchId ? `/api/payments/reminders/overdue?batch_id=${batchId}` : '/api/payments/reminders/overdue';
    return request(endpoint);
};

export const sendPaymentReminder = (reminderData) => {
    return request('/api/payments/reminders/send', {
        method: 'POST',
        body: JSON.stringify(reminderData)
    });
};

export const sendBulkReminders = (bulkReminderData) => {
    return request('/api/payments/reminders/send-bulk', {
        method: 'POST',
        body: JSON.stringify(bulkReminderData)
    });
};

export const getReminderHistory = (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return request(`/api/payments/reminders/history?${queryParams}`);
};

export const getReminderTemplates = () => request('/api/payments/reminders/templates');
export const updateReminderTemplates = (templates) => {
    return request('/api/payments/reminders/templates', {
        method: 'PUT',
        body: JSON.stringify(templates)
    });
};

export const getReminderSettings = () => request('/api/payments/reminders/settings');
export const updateReminderSettings = (settings) => {
    return request('/api/payments/reminders/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
    });
};

// --- Payment Analytics API ---

export const getPaymentAnalytics = (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return request(`/api/payments/analytics?${queryParams}`);
};

export const getRevenueTrends = (timeRange = '30d', batchId = null) => {
    const params = new URLSearchParams({ time_range: timeRange });
    if (batchId) params.append('batch_id', batchId);
    return request(`/api/payments/analytics/revenue-trends?${params}`);
};

export const getTopBatches = (timeRange = '30d') => {
    return request(`/api/payments/analytics/top-batches?time_range=${timeRange}`);
};

export const getPaymentMethodDistribution = (timeRange = '30d') => {
    return request(`/api/payments/analytics/payment-methods?time_range=${timeRange}`);
};

export const getMonthlyRevenue = (year = new Date().getFullYear()) => {
    return request(`/api/payments/analytics/monthly-revenue?year=${year}`);
};

export const getDailyRevenue = (startDate, endDate) => {
    return request(`/api/payments/analytics/daily-revenue?start_date=${startDate}&end_date=${endDate}`);
};

// --- Razorpay Integration API ---

export const createRazorpayAccount = () => {
    return request('/api/teacher/razorpay-account', {
        method: 'POST'
    });
};

export const getRazorpayAccountStatus = () => request('/api/teacher/razorpay-account/status');

export const createPaymentLink = (batchId, linkData) => {
    return request(`/api/batches/${batchId}/payment-link`, {
        method: 'POST',
        body: JSON.stringify(linkData)
    });
};

export const getPaymentLinks = (batchId = null) => {
    const endpoint = batchId ? `/api/batches/${batchId}/payment-links` : '/api/payment-links';
    return request(endpoint);
};

// --- Settlement API ---

export const processInstantSettlement = (paymentId) => {
    return request('/api/payments/instant-settlement', {
        method: 'POST',
        body: JSON.stringify({ payment_id: paymentId })
    });
};

export const processExpressSettlement = (paymentId) => {
    return request('/api/payments/express-settlement', {
        method: 'POST',
        body: JSON.stringify({ payment_id: paymentId })
    });
};

export const getSettlementHistory = () => request('/api/payments/settlements/history');

// --- Admin API (with admin key) ---

export const toggleBetaTesting = (enable) => {
    return request('/api/admin/beta-testing/toggle', {
        method: 'POST',
        body: JSON.stringify({ enable }),
        headers: {
            'X-Admin-Key': import.meta.env.VITE_ADMIN_KEY
        }
    });
};

export const toggleRazorpayFees = (platformPays) => {
    return request('/api/admin/razorpay-fees/toggle', {
        method: 'POST',
        body: JSON.stringify({ platform_pays: platformPays }),
        headers: {
            'X-Admin-Key': import.meta.env.VITE_ADMIN_KEY
        }
    });
};

export const getSubscriptionConfig = () => {
    return request('/api/admin/subscription/config', {
        headers: {
            'X-Admin-Key': import.meta.env.VITE_ADMIN_KEY
        }
    });
};

export const updateSubscriptionConfig = (config) => {
    return request('/api/admin/subscription/update-config', {
        method: 'POST',
        body: JSON.stringify(config),
        headers: {
            'X-Admin-Key': import.meta.env.VITE_ADMIN_KEY
        }
    });
};

export const getSystemHealth = () => {
    return request('/api/admin/system/health', {
        headers: {
            'X-Admin-Key': import.meta.env.VITE_ADMIN_KEY
        }
    });
};

// --- Utility Functions ---

export const exportPaymentData = (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams({ format, ...filters }).toString();
    return request(`/api/payments/export?${queryParams}`);
};

export const downloadReceipt = (paymentId) => {
    return request(`/api/payments/${paymentId}/receipt`);
};

export const getPaymentReceipts = (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return request(`/api/payments/receipts?${queryParams}`);
};

// --- Webhook Handlers ---

export const handleRazorpayWebhook = (webhookData) => {
    return request('/api/webhooks/razorpay', {
        method: 'POST',
        body: JSON.stringify(webhookData)
    });
};

// --- Search and Filter Functions ---

export const searchPayments = (searchTerm, filters = {}) => {
    const queryParams = new URLSearchParams({ 
        search: searchTerm, 
        ...filters 
    }).toString();
    return request(`/api/payments/search?${queryParams}`);
};

export const searchStudentPayments = (searchTerm, filters = {}) => {
    const queryParams = new URLSearchParams({ 
        search: searchTerm, 
        ...filters 
    }).toString();
    return request(`/api/student/payments/search?${queryParams}`);
};

export const searchTeacherPayments = (searchTerm, filters = {}) => {
    const queryParams = new URLSearchParams({ 
        search: searchTerm, 
        ...filters 
    }).toString();
    return request(`/api/teacher/payments/search?${queryParams}`);
};

// --- Batch Payment Management ---

export const getBatchStudentPayments = (batchId, studentId = null) => {
    const endpoint = studentId 
        ? `/api/batches/${batchId}/students/${studentId}/payments`
        : `/api/batches/${batchId}/students/payments`;
    return request(endpoint);
};

export const markStudentPayment = (batchId, studentId, paymentData) => {
    return request(`/api/batches/${batchId}/students/${studentId}/payments`, {
        method: 'POST',
        body: JSON.stringify(paymentData)
    });
};

export const updateStudentPayment = (paymentId, paymentData) => {
    return request(`/api/payments/${paymentId}`, {
        method: 'PUT',
        body: JSON.stringify(paymentData)
    });
};

export const deleteStudentPayment = (paymentId) => {
    return request(`/api/payments/${paymentId}`, {
        method: 'DELETE'
    });
};

// --- Material Access Control ---

export const checkBatchMaterialAccess = (batchId) => {
    return request(`/api/batches/${batchId}/materials/access-check`);
};

export const lockBatchMaterials = (batchId) => {
    return request(`/api/batches/${batchId}/materials/lock`, {
        method: 'POST'
    });
};

export const unlockBatchMaterials = (batchId) => {
    return request(`/api/batches/${batchId}/materials/unlock`, {
        method: 'POST'
    });
};

// --- Notification System ---

export const sendPaymentNotification = (notificationData) => {
    return request('/api/notifications/payment', {
        method: 'POST',
        body: JSON.stringify(notificationData)
    });
};

export const getPaymentNotifications = (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return request(`/api/notifications/payment?${queryParams}`);
};

export const markNotificationRead = (notificationId) => {
    return request(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
    });
};

// --- Report Generation ---

export const generatePaymentReport = (reportData) => {
    return request('/api/reports/payments', {
        method: 'POST',
        body: JSON.stringify(reportData)
    });
};

export const generateRevenueReport = (reportData) => {
    return request('/api/reports/revenue', {
        method: 'POST',
        body: JSON.stringify(reportData)
    });
};

export const generateSubscriptionReport = (reportData) => {
    return request('/api/reports/subscription', {
        method: 'POST',
        body: JSON.stringify(reportData)
    });
};

export default {
    // Payment Management
    getTeacherPayments,
    getTeacherPaymentSummary,
    getTeacherPaymentAnalytics,
    getStudentPayments,
    getStudentPaymentSummary,
    getStudentBatchPaymentStatus,
    
    // Payment Processing
    initiateOnlinePayment,
    verifyOnlinePayment,
    createCashPayment,
    
    // Subscription Management
    getTeacherSubscriptionStatus,
    calculateSubscriptionFee,
    createTeacherSubscription,
    getTeacherSubscriptionMetrics,
    getTeacherSubscriptionPayments,
    processSubscriptionPayment,
    calculateIncrementalSubscription,
    checkSubscriptionStatus,
    checkMaterialAccess,
    
    // Reminder System
    getOverdueStudents,
    sendPaymentReminder,
    sendBulkReminders,
    getReminderHistory,
    getReminderTemplates,
    updateReminderTemplates,
    getReminderSettings,
    updateReminderSettings,
    
    // Analytics
    getPaymentAnalytics,
    getRevenueTrends,
    getTopBatches,
    getPaymentMethodDistribution,
    getMonthlyRevenue,
    getDailyRevenue,
    
    // Razorpay Integration
    createRazorpayAccount,
    getRazorpayAccountStatus,
    createPaymentLink,
    getPaymentLinks,
    
    // Settlement
    processInstantSettlement,
    processExpressSettlement,
    getSettlementHistory,
    
    // Admin Functions
    toggleBetaTesting,
    toggleRazorpayFees,
    getSubscriptionConfig,
    updateSubscriptionConfig,
    getSystemHealth,
    
    // Utility Functions
    exportPaymentData,
    downloadReceipt,
    getPaymentReceipts,
    handleRazorpayWebhook,
    
    // Search Functions
    searchPayments,
    searchStudentPayments,
    searchTeacherPayments,
    
    // Batch Payment Management
    getBatchStudentPayments,
    markStudentPayment,
    updateStudentPayment,
    deleteStudentPayment,
    
    // Material Access Control
    checkBatchMaterialAccess,
    lockBatchMaterials,
    unlockBatchMaterials,
    
    // Notifications
    sendPaymentNotification,
    getPaymentNotifications,
    markNotificationRead,
    
    // Reports
    generatePaymentReport,
    generateRevenueReport,
    generateSubscriptionReport
};
