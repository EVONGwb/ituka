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
import CustomerTabLayout from "./components/CustomerTabLayout";

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
import AdminAnalytics from "./pages/admin/Analytics";
import AdminIndex from "./pages/admin/AdminIndex";
import RequirePermission from "./components/admin/RequirePermission";

import WelcomeScreen from "./pages/WelcomeScreen";

function Home() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route element={<CustomerTabLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/requests" element={<MyRequests />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/about" element={<Dashboard />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminIndex />} />
        <Route
          path="dashboard"
          element={
            <RequirePermission permission="dashboard:read">
              <AdminDashboard />
            </RequirePermission>
          }
        />
        <Route
          path="analytics"
          element={
            <RequirePermission permission="analytics:read">
              <AdminAnalytics />
            </RequirePermission>
          }
        />
        <Route
          path="products"
          element={
            <RequirePermission permission="products:read">
              <AdminProducts />
            </RequirePermission>
          }
        />
        <Route
          path="requests"
          element={
            <RequirePermission permission="requests:read">
              <AdminRequests />
            </RequirePermission>
          }
        />
        <Route
          path="orders"
          element={
            <RequirePermission permission="orders:read">
              <AdminOrders />
            </RequirePermission>
          }
        />
        <Route
          path="clients"
          element={
            <RequirePermission permission="clients:read">
              <AdminClients />
            </RequirePermission>
          }
        />
        <Route
          path="clients/:id"
          element={
            <RequirePermission permission="clients:read">
              <AdminClientProfile />
            </RequirePermission>
          }
        />
        <Route
          path="chats"
          element={
            <RequirePermission permission="chats:read">
              <AdminChats />
            </RequirePermission>
          }
        />
        <Route
          path="chats/:userId"
          element={
            <RequirePermission permission="chats:read">
              <AdminChats />
            </RequirePermission>
          }
        />
        <Route
          path="settings"
          element={
            <RequirePermission permission="*">
              <AdminSettings />
            </RequirePermission>
          }
        />
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
