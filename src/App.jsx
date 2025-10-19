import { Route, Routes } from "react-router-dom"
import Landing from "./Landing Page/Landing"
import Navbar from "./Navbar/Navbar"
import SignIn from "./Signin"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Landing />}></Route>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
      </Routes>
    </>
  )
}

export default App