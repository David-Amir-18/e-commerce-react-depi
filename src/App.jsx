import { Route, Routes, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./Landing Page/Landing";
import Navbar from "./Navbar/Navbar";
import SignIn from "./Login/Signin";
import Register from "./Login/Register";
import ForgetPass from "./Login/ForgetPass";
import Footer from "./Footer/Footer";
import VerifyOTP from "./Login/VerifyOTP";
import ResetPassword from "./Login/ResetPassword";
import UserProfile from "./Profile/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import FlightResultsPage from "./pages/FlightResultsPage";
import Dashboard from "./admin/Dashboard";
import AdminBookings from "./admin/Bookings";
import AdminUsers from "./admin/Users";
import AdminLayout from "./admin/components/AdminLayout";
import PassengerDetailsPage from "./pages/PassengerDetailsPage";
import BookingOptionsPage from "./pages/BookingOptionsPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import FoodSelectionPage from "./pages/FoodSelectionPage";
import BaggageSelectionPage from "./pages/BaggageSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        {!isAdminRoute && <Navbar />}
        <Routes>
          <Route index element={<Landing />}></Route>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/forgetpass" element={<ForgetPass />}></Route>
          <Route path="/verify-otp" element={<VerifyOTP />}></Route>
          <Route path="/reset-password" element={<ResetPassword />}></Route>
          <Route path="/flights" element={<FlightResultsPage />}></Route>
          <Route path="/passenger-details" element={<PassengerDetailsPage />}></Route>
          <Route path="/booking/options" element={<BookingOptionsPage />}></Route>
          <Route path="/booking/seat-selection" element={<SeatSelectionPage />}></Route>
          <Route path="/booking/food-selection" element={<FoodSelectionPage />}></Route>
          <Route path="/booking/baggage-selection" element={<BaggageSelectionPage />}></Route>
          <Route path="/booking/payment" element={<PaymentPage />}></Route>

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          ></Route>

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          ></Route>
          <Route
            path="/admin/bookings"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminBookings />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          ></Route>
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          ></Route>
        </Routes>
        {!isAdminRoute && <Footer />}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
