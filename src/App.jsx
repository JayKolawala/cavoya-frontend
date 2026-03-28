// App.jsx
import React, { Suspense, lazy, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";


import { AdminProvider } from "./contexts/AdminContext";
import { AuthProvider } from "./contexts/AuthContext";
import useAuth from "./hooks/useAuth";

// --- Layout & Shell Components (always loaded eagerly, they're tiny) ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import CustomAlert from "./components/CustomAlert";
import ScrollToTop from "./components/ScrollToTop";
import AppLoader from "./components/AppLoader";
import LoadingSpinner from "./components/LoadingSpinner";

// --- Lazy-loaded Public Pages ---
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const ReturnsPage = lazy(() => import("./pages/ReturnsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RateOrderPage = lazy(() => import("./pages/RateOrderPage"));

// --- Lazy-loaded Admin Pages ---
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ProductManagement = lazy(() => import("./pages/admin/ProductManagement"));
const OrderManager = lazy(() => import("./pages/admin/OrderManager"));
const CustomerManager = lazy(() => import("./pages/admin/CustomerManager"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// ---------------------------------------------------------------------------
// Layout Routes
// ---------------------------------------------------------------------------

/** Wraps all public pages with Header + Footer */
const PublicLayout = () => (
  <>
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
);

// ---------------------------------------------------------------------------
// Auth Guard Routes  (use <Outlet /> — works cleanly with nested routes)
// ---------------------------------------------------------------------------

/** Protects admin routes. Shows nothing while session is being verified,
 *  then redirects to /admin/login if not authenticated. */
const ProtectedAdminRoute = () => {
  const { isAdminAuthenticated, authLoading } = useAuth();
  if (authLoading) return null; // wait for /me check — prevents redirect flash on refresh
  return isAdminAuthenticated
    ? <Outlet />
    : <Navigate to="/admin/login" replace />;
};

/** Protects user-only routes. Redirects to /login if not authenticated. */
const ProtectedUserRoute = () => {
  const { isUserAuthenticated } = useAuth();
  return isUserAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

function App() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <HelmetProvider>
      {showLoader && <AppLoader onLoadComplete={() => setShowLoader(false)} />}
      <AuthProvider>
        <Router>
          <ScrollToTop>
            <div className="min-h-screen flex flex-col text-gray-800">
              {/*
              Suspense boundary wraps all lazy routes.
              Swap the fallback for a proper skeleton/spinner as needed.
            */}
              <Suspense fallback={<div className="flex h-screen items-center justify-center"><LoadingSpinner /></div>}>
                <Routes>

                  {/* ── Standalone pages (no Header / Footer) ── */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* ── Admin area ──────────────────────────────
                    Layer 0: Admin Context
                    Layer 1: auth guard (ProtectedAdminRoute)
                    Layer 2: layout     (AdminLayout with <Outlet />)
                    Layer 3: pages
                */}
                  <Route element={<AdminProvider><ProtectedAdminRoute /></AdminProvider>}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="products" element={<ProductManagement />} />
                      <Route path="orders" element={<OrderManager />} />
                      <Route path="customers" element={<CustomerManager />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                  </Route>

                  {/* ── Public pages (Header + Footer via PublicLayout) ── */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/shipping" element={<ShippingPage />} />
                    <Route path="/returns" element={<ReturnsPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-and-conditions" element={<TermsPage />} />
                    <Route path="/refund-and-return-policy" element={<ReturnsPage />} />
                    <Route path="/rate-order/:orderId" element={<RateOrderPage />} />

                    {/* Protected user routes — uncomment ProtectedUserRoute
                      wrapper once auth is fully wired */}
                    {/* <Route element={<ProtectedUserRoute />}> */}
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    {/* </Route> */}

                    {/* 404 — keep LAST inside PublicLayout so it gets the shell */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                </Routes>
              </Suspense>

              <CustomAlert />
            </div>
          </ScrollToTop>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
