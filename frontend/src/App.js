import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import { Toaster } from "./components/ui/toaster";

const AppContent = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated()) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/*" element={
        role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />
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
