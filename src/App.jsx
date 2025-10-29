import { Route, Routes } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "./contexts/AuthContext"
import Landing from "./Landing Page/Landing"
import Navbar from "./Navbar/Navbar"
import SignIn from "./Login/Signin"
import Register from "./Login/Register"
import ForgetPass from "./Login/ForgetPass"
import Footer from "./Footer/Footer"
import VerifyOTP from "./Login/VerifyOTP"
import ResetPassword from "./Login/ResetPassword"
import UserProfile from "./Profile/UserProfile"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route index element={<Landing />}></Route>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/forgetpass" element={<ForgetPass />}></Route>
          <Route path="/verify-otp" element={<VerifyOTP />}></Route>
          <Route path="/reset-password" element={<ResetPassword />}></Route>

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>}></Route>
        </Routes>
        <Footer />
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App