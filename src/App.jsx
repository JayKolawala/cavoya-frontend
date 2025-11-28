// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AdminProvider } from "./contexts/AdminContext";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";
import CustomAlert from "./components/CustomAlert";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import AdminLayout from "./pages/admin/AdminLayout";
import OrderManager from "./pages/admin/OrderManager";
import CustomerManager from "./pages/admin/CustomerManager";

// Admin Route Protection Component
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Regular User Route Protection Component (if needed)
const ProtectedUserRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userAuth") === "true";
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AppProvider>
      <AdminProvider>
        <Router>
          <ScrollToTop>
            <div className="min-h-screen flex flex-col text-gray-800">
              <Routes>
                {/* Public Routes without Header/Footer */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Routes (without Header/Footer) */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="orders" element={<OrderManager />} />
                  <Route path="customers" element={<CustomerManager />} />
                </Route>

                {/* Public Routes with Header/Footer */}
                <Route
                  path="*"
                  element={
                    <>
                      <main className="flex-grow">
                        <Header />
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route
                            path="/product/:id"
                            element={<ProductPage />}
                          />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/about" element={<AboutPage />} />

                          {/* Protected User Routes */}
                          <Route
                            path="/checkout"
                            element={
                              // <ProtectedUserRoute>
                              <CheckoutPage />
                              // </ProtectedUserRoute>
                            }
                          />
                          <Route
                            path="/payment"
                            element={
                              // <ProtectedUserRoute>
                              <PaymentPage />
                              // </ProtectedUserRoute>
                            }
                          />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />
              </Routes>
              <CustomAlert />
            </div>
          </ScrollToTop>
        </Router>
      </AdminProvider>
    </AppProvider>
  );
}

export default App;
