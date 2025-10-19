import { Route, Routes } from "react-router-dom"
import Landing from "./Landing Page/Landing"
import Navbar from "./Navbar/Navbar"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Landing />}></Route>
      </Routes>
    </>
  )
}

export default App
