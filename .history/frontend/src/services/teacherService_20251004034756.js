// 👨‍🏫 Teacher Service
// This file handles all teacher-related API calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'your-api-key-here';

// Helper function for API calls
const fetchAPI = async (endpoint, options = {}) => {
    const defaultHeaders = {
        'X-API-Key': API_KEY
    };

    // If content type is not multipart/form-data, set application/json
    if (!options.body || !(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        },
        credentials: 'include' // Always include credentials for cookies
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
};

export const teacherService = {
    // Register a new teacher
    register: async (formData) => {
        try {
            return await fetchAPI('/teacher/register', {
                method: 'POST',
                body: formData // FormData for multipart/form-data
            });
        } catch (error) {
            console.error('Teacher Registration Error:', error);
            throw error;
        }
    },

    // Login teacher
    login: async (credentials) => {
        try {
            return await fetchAPI('/teacher/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
        } catch (error) {
            console.error('Teacher Login Error:', error);
            throw error;
        }
    },

    // Delete teacher
    deleteTeacher: async (teacherId) => {
        try {
            return await fetchAPI(`/teachers/${teacherId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Delete Teacher Error:', error);
            throw error;
        }
    },

    // Get teacher's batches
    getTeacherBatches: async (teacherId) => {
        try {
            return await fetchAPI(`/teachers/${teacherId}/batches`);
        } catch (error) {
            console.error('Get Teacher Batches Error:', error);
            throw error;
        }
    },

    // Get teacher's students
    getTeacherStudents: async (teacherId) => {
        try {
            return await fetchAPI(`/teachers/${teacherId}/students`);
        } catch (error) {
            console.error('Get Teacher Students Error:', error);
            throw error;
        }
    }
};

// TODO: Add more teacher-specific methods as needed
// - Create batch
// - Update batch
// - Delete batch
// - Get teacher dashboard data
// - Get teacher analytics
