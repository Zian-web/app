import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import TeacherDashboard from "./components/dashboard/TeacherDashboard";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import TeacherRegister from "./components/teacher/TeacherRegister";
import StudentRegister from "./components/student/StudentRegister";
import ForgotPassword from "./components/auth/ForgotPassword";
import { Toaster } from "./components/ui/toaster";

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // With the flattened user object, we can rely solely on `user.type`
  const userRole = user.type;

  if (requiredRole && userRole !== requiredRole) {
    const dashboardPath = userRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register/teacher" element={<TeacherRegister />} />
      <Route path="/register/student" element={<StudentRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route 
        path="/teacher/dashboard"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/student/dashboard" 
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default route / Redirects */}
      <Route 
        path="/"
        element={
          !user 
            ? <Navigate to="/login" replace /> 
            : user.type === 'teacher' 
              ? <Navigate to="/teacher/dashboard" replace /> 
              : <Navigate to="/student/dashboard" replace />
        }
      />

      {/* 404 Not Found Route */}
      <Route path="*" element={
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl">404 - Page Not Found</h1>
        </div>
      } />
    </Routes>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;