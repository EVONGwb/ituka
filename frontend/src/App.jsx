import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthContext";

import Cart from "./pages/Cart";
import Chat from "./pages/Chat";
import MyRequests from "./pages/MyRequests";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";

// Admin Imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminRequests from "./pages/admin/Requests";
import AdminOrders from "./pages/admin/Orders";
import AdminClients from "./pages/admin/Clients";
import AdminChats from "./pages/admin/Chats";
import AdminClientProfile from "./pages/admin/ClientProfile";
import AdminSettings from "./pages/admin/Settings";

import WelcomeScreen from "./pages/WelcomeScreen";

function Home() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<Dashboard />} />
      <Route path="/products" element={<ProductCatalog />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/requests" element={<MyRequests />} />
      <Route path="/profile" element={<Profile />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="clients/:id" element={<AdminClientProfile />} />
        <Route path="chats" element={<AdminChats />} />
        <Route path="chats/:userId" element={<AdminChats />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<WelcomeScreen />} />
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
