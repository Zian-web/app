import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import StudentDashboard from "./components/student/StudentDashboard";
import TeacherRegister from "./components/teacher/TeacherRegister";
import StudentRegister from "./components/student/StudentRegister";
import ForgotPassword from "./pages/ForgotPassword";
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
      {isAuthenticated() ? (
        <Route path="/*" element={
          role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />
        } />
      ) : (
        <Route path="/*" element={<Login />} />
      )}
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
