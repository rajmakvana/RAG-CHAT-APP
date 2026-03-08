import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage from "./pages/LandingPage";
import RegisterOrg from "./pages/RegisterOrg";
import Login from "./pages/Login";
import AcceptInvite from "./pages/AcceptInvite";
import AppLayout from "./components/AppLayout";
import Chat from "./pages/Chat";
import { ChatProvider } from "./context/ChatContext";
import AdminDashboard from "./pages/AdminDashboard";

// Role-based protection for Admin routes
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') return <Navigate to="/chat" replace />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register-org" element={<RegisterOrg />} />
            <Route path="/login" element={<Login />} />
            <Route path="/accept-invite/:token" element={<AcceptInvite />} />

            {/* Protected Routes inside the Main Layout */}
            <Route element={<AppLayout />}>
              {/* All users can access chat */}
              <Route path="/chat" element={<Chat />} />

              {/* Only Admins can access consolidated dashboard */}
              <Route path="/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
