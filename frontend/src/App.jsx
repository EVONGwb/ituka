import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import { getToken } from "./lib/auth";
import { AuthProvider } from "./context/AuthContext";

// Admin Imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminRequests from "./pages/admin/Requests";
import AdminOrders from "./pages/admin/Orders";
import AdminClients from "./pages/admin/Clients";
import AdminChats from "./pages/admin/Chats";

import WelcomeScreen from "./pages/WelcomeScreen";

function Home() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(!!getToken());

  useEffect(() => {
    setAuthed(!!getToken());
  }, []);

  function onAuthed() {
    setAuthed(true);
  }

  function onLogout() {
    setAuthed(false);
    navigate("/login");
  }

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<Login onAuthed={onAuthed} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register onAuthed={onAuthed} />} />
      <Route path="/dashboard" element={<Dashboard onLogout={onLogout} />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="chats" element={<AdminChats />} />
        <Route path="chats/:userId" element={<AdminChats />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </AuthProvider>
  );
}
