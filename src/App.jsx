import { Route, Routes } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Landing from "./Landing Page/Landing"
import Navbar from "./Navbar/Navbar"
import SignIn from "./Login/Signin"
import Register from "./Login/Register"
import ForgetPass from "./Login/ForgetPass"
import VerifyOTP from "./Login/VerifyOTP"
import ResetPassword from "./Login/ResetPassword"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
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

        {/* Example of protected route - wrap any route that needs authentication */}
        {/* <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}></Route> */}
      </Routes>
    </AuthProvider>
  )
}

export default App