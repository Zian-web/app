// 👨‍🏫 Teacher Service
// This file handles all teacher-related API calls
// TODO: Connect to your backend teacher endpoints

import { api } from './api.js';

export const teacherService = {
  // Get all teachers
  getAllTeachers: async () => {
    try {
      const response = await api.get('/teachers');
      return response;
    } catch (error) {
      console.error('Get all teachers failed:', error);
      throw error;
    }
  },

  // Get teacher by ID
  getTeacherById: async (teacherId) => {
    try {
      const response = await api.get(`/teachers/${teacherId}`);
      return response;
    } catch (error) {
      console.error('Get teacher by ID failed:', error);
      throw error;
    }
  },

  // Create new teacher
  createTeacher: async (teacherData) => {
    try {
      const response = await api.post('/teachers', teacherData);
      return response;
    } catch (error) {
      console.error('Create teacher failed:', error);
      throw error;
    }
  },

  // Update teacher
  updateTeacher: async (teacherId, teacherData) => {
    try {
      const response = await api.put(`/teachers/${teacherId}`, teacherData);
      return response;
    } catch (error) {
      console.error('Update teacher failed:', error);
      throw error;
    }
  },

  // Delete teacher
  deleteTeacher: async (teacherId) => {
    try {
      const response = await api.delete(`/teachers/${teacherId}`);
      return response;
    } catch (error) {
      console.error('Delete teacher failed:', error);
      throw error;
    }
  },

  // Get teacher's batches
  getTeacherBatches: async (teacherId) => {
    try {
      const response = await api.get(`/teachers/${teacherId}/batches`);
      return response;
    } catch (error) {
      console.error('Get teacher batches failed:', error);
      throw error;
    }
  },

  // Get teacher's students
  getTeacherStudents: async (teacherId) => {
    try {
      const response = await api.get(`/teachers/${teacherId}/students`);
      return response;
    } catch (error) {
      console.error('Get teacher students failed:', error);
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
