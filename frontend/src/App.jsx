import React from "react";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import TeacherDashboard from "./components/dashboard/TeacherDashboard";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import TeacherRegister from "./components/teacher/TeacherRegister";
import StudentRegister from "./components/student/StudentRegister";
import ForgotPassword from "./components/auth/ForgotPassword";
import { Toaster } from "./components/ui/toaster";

const AppContent = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register/teacher" element={<TeacherRegister />} />
      <Route path="/register/student" element={<StudentRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          isAuthenticated() ? (
            role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />
          ) : (
            <Login />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <HashRouter>
          <AppContent />
          <Toaster />
        </HashRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
