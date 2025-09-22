import React, { createContext, useContext, useState } from 'react';
import { mockTeachers, mockStudents } from '../mock';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = (id, password, selectedRole) => {
    let userData = null;
    
    if (selectedRole === 'teacher') {
      userData = mockTeachers.find(teacher => teacher.id === id && teacher.password === password);
    } else if (selectedRole === 'student') {
      userData = mockStudents.find(student => student.id === id && student.password === password);
    }

    if (userData) {
      setUser(userData);
      setRole(selectedRole);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  const isAuthenticated = () => {
    return user !== null && role !== null;
  };

  const value = {
    user,
    role,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};