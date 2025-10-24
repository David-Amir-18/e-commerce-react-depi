import { Route, Routes } from "react-router-dom"
import Landing from "./Landing Page/Landing"
import Navbar from "./Navbar/Navbar"
import SignIn from "./Login/Signin"
import Register from "./Login/Register"
import ForgetPass from "./Login/ForgetPass"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Landing />}></Route>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forgetpass" element={<ForgetPass />}></Route>
      </Routes>
    </>
  )
}

export default App