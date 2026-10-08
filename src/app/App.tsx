
import { Routes, Route } from "react-router-dom"
import Notfound from "@/components/layout/Notfound"
import Testing from "@/test/Testing"
import DashboardLayout from "../components/layout/DashboardLayout"
import Home from "../pages/company/Home"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element= {<DashboardLayout />}>
          <Route index element={<Home />} />
          
        </Route>

        <Route path="/test" element= { <Testing /> } />

        <Route path="*" element={ <Notfound />} />
      </Routes>
    </>
  )
}

export default App