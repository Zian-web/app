// --- UPDATED FOR VITE ---
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

    // For file uploads, let the browser set the Content-Type header
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
            return null; // No content to parse
        }

        let responseData;
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            // Handle HTML responses - check if it's a payment page
            const text = await response.text();
            
            // Check if this is a payment page (contains payment-related content)
            if (text.includes("Payment") && text.includes("Razorpay") && response.ok) {
                // This is a payment page, redirect to it
                console.log("Payment page received, redirecting...");
                window.location.href = url;
                return { success: true, redirect: true };
            } else {
                // This is an error page
                console.error("Non-JSON response received:", text);
                throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
            }
        }

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

// --- Authentication & User Functions ---
export const loginUser = (email, password, role) => {
    return request(ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ id: email, password, role })
    });
};

export const registerTeacher = (formData) => {
    return request(ENDPOINTS.AUTH.REGISTER_TEACHER, {
        method: "POST",
        body: formData
    });
};

export const registerStudent = (formData) => {
    return request(ENDPOINTS.AUTH.REGISTER_STUDENT, {
        method: "POST",
        body: formData
    });
};

export const getCurrentUser = () => request(ENDPOINTS.USERS.ME);

// --- Batch Management Functions ---
export const getMyBatches = () => request(ENDPOINTS.BATCH.LIST);
export const getStudentBatches = () => request(ENDPOINTS.BATCH.STUDENT.LIST);

export const createBatch = (data) => {
    return request(ENDPOINTS.BATCH.CREATE, {
        method: "POST",
        body: JSON.stringify(data)
    });
};

export const updateBatch = (batchId, data) => {
    return request(ENDPOINTS.BATCH.UPDATE(batchId), {
        method: "PUT",
        body: JSON.stringify(data)
    });
};

export const deleteBatch = (batchId) => {
    return request(ENDPOINTS.BATCH.DELETE(batchId), { method: "DELETE" });
};

export const getBatchDetails = (batchId) => request(ENDPOINTS.BATCH.DETAILS(batchId));

// --- Batch Code & Limit Management ---
export const generateJoinCode = (batchId) => {
    return request(ENDPOINTS.BATCH.GENERATE_CODE(batchId), { method: "POST" });
};

export const increaseBatchLimit = (batchId, newLimit) => {
    return request(ENDPOINTS.BATCH.INCREASE_LIMIT(batchId), {
        method: "PUT",
        body: JSON.stringify({ student_limit: newLimit })
    });
};

// --- Student-Batch Interaction ---
export const joinBatch = (joinCode) => {
    return request(ENDPOINTS.BATCH.JOIN, {
        method: "POST",
        body: JSON.stringify({ join_code: joinCode })
    });
};

export const getBatchStudents = (batchId) => request(ENDPOINTS.BATCH.STUDENTS.LIST(batchId));

export const toggleStudentAccess = (batchId, studentId) => {
    return request(ENDPOINTS.BATCH.STUDENTS.TOGGLE_ACCESS(batchId, studentId), { method: "POST" });
};

export const removeStudent = (enrollmentId) => {
    return request(ENDPOINTS.BATCH.STUDENTS.REMOVE(enrollmentId), { method: "DELETE" });
};

// --- Material Management ---
export const getBatchMaterials = (batchId) => request(ENDPOINTS.BATCH.MATERIALS.LIST(batchId));

export const uploadMaterial = (batchId, formData) => {
    return request(ENDPOINTS.BATCH.MATERIALS.CREATE(batchId), {
        method: "POST",
        body: formData
    });
};

export const deleteMaterial = (materialId) => {
    return request(ENDPOINTS.MATERIALS.DELETE(materialId), { method: "DELETE" });
};

export const getMaterialPresignedUrl = (materialId) => request(ENDPOINTS.MATERIALS.PRESIGNED_URL(materialId));

export const updateBatchMaterial = (materialId, data) => {
    return request(ENDPOINTS.MATERIALS.UPDATE(materialId), {
        method: "PUT",
        body: JSON.stringify(data)
    });
};

export const checkMaterialPermissions = (materialId) => request(ENDPOINTS.MATERIALS.CHECK_PERMISSIONS(materialId));

export const toggleMaterialPublish = (materialId) => {
    return request(ENDPOINTS.MATERIALS.TOGGLE_PUBLISH(materialId), { method: "POST" });
};

export const toggleMaterialAccess = (materialId, studentId) => {
    return request(ENDPOINTS.MATERIALS.TOGGLE_ACCESS(materialId, studentId), { method: "POST" });
};

export const getBatchStudentMaterials = (batchId, studentId) => {
    return request(ENDPOINTS.BATCH.MATERIALS.STUDENT_ACCESS(batchId, studentId));
};

// --- Joining Requests Management ---
export const getJoiningRequests = (batchId) => request(ENDPOINTS.BATCH.JOINING_REQUESTS.LIST(batchId));

export const approveJoinRequest = (requestId) => {
    return request(ENDPOINTS.BATCH.JOINING_REQUESTS.APPROVE(requestId), { method: "POST" });
};

export const rejectJoinRequest = (requestId) => {
    return request(ENDPOINTS.BATCH.JOINING_REQUESTS.REJECT(requestId), { method: "POST" });
};

// --- Notification Management ---
export const createNotification = (batchId, data) => {
    return request(ENDPOINTS.BATCH.NOTIFICATIONS.CREATE(batchId), {
        method: "POST",
        body: JSON.stringify(data)
    });
};

export const getNotificationsForBatch = (batchId) => request(ENDPOINTS.BATCH.NOTIFICATIONS.LIST(batchId));

// --- Payment Management ---
export const getPaymentsForBatch = (batchId) => request(`/api/batches/${batchId}/payments`);

// --- Statistics Functions ---
export const getTotalStudents = () => request(ENDPOINTS.STATS.TOTAL_STUDENTS);
export const getStudentStats = (studentId) => request(ENDPOINTS.STATS.STUDENT(studentId));
export const getMaterialStats = (materialId) => request(ENDPOINTS.STATS.MATERIAL(materialId));
export const getPaymentStats = (batchId) => request(ENDPOINTS.STATS.PAYMENTS(batchId));
export const getAttendanceStats = (batchId) => request(ENDPOINTS.STATS.ATTENDANCE(batchId));

// --- Convenience Methods ---
export const api = {
    get: (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" }),
    post: (endpoint, body, options = {}) => {
        const config = { ...options, method: "POST" };
        if (body) {
            config.body = (body instanceof FormData) ? body : JSON.stringify(body);
        }
        return request(endpoint, config);
    },
    put: (endpoint, body, options = {}) => {
        const config = { ...options, method: "PUT" };
        if (body) {
            config.body = (body instanceof FormData) ? body : JSON.stringify(body);
        }
        return request(endpoint, config);
    },
    delete: (endpoint, options = {}) => request(endpoint, { ...options, method: "DELETE" }),
};
