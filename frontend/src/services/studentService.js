// 👨‍🎓 Student Service
// This file handles all student-related API calls
// TODO: Connect to your backend student endpoints

import { api } from '../lib/api.js';

export const studentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      return response;
    } catch (error) {
      console.error('Get all students failed:', error);
      throw error;
    }
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}`);
      return response;
    } catch (error) {
      console.error('Get student by ID failed:', error);
      throw error;
    }
  },

  // Create new student
  createStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      return response;
    } catch (error) {
      console.error('Create student failed:', error);
      throw error;
    }
  },

  // Update student
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await api.put(`/students/${studentId}`, studentData);
      return response;
    } catch (error) {
      console.error('Update student failed:', error);
      throw error;
    }
  },

  // Delete student
  deleteStudent: async (studentId) => {
    try {
      const response = await api.delete(`/students/${studentId}`);
      return response;
    } catch (error) {
      console.error('Delete student failed:', error);
      throw error;
    }
  },

  // Get student's batches
  getStudentBatches: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/batches`);
      return response;
    } catch (error) {
      console.error('Get student batches failed:', error);
      throw error;
    }
  },

  // Get student's attendance
  getStudentAttendance: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/attendance`);
      return response;
    } catch (error) {
      console.error('Get student attendance failed:', error);
      throw error;
    }
  },

  // Get student's payments
  getStudentPayments: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/payments`);
      return response;
    } catch (error) {
      console.error('Get student payments failed:', error);
      throw error;
    }
  }
};

// TODO: Add more student-specific methods as needed
// - Enroll in batch
// - Unenroll from batch
// - Get student progress
// - Get student materials
