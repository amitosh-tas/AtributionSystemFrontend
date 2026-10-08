
import { Routes, Route } from "react-router-dom"
import Notfound from "@/components/layout/Notfound"
import Testing from "@/test/Testing"
import DashboardLayout from "../components/layout/DashboardLayout"
import Overview from "../pages/company/Overview"
import Analytics from "@/pages/company/Analytics"
import Transactions from "@/pages/company/Transactions"
import Customers from "@/pages/company/Customers"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element= {<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/customers" element={<Customers />} />
        </Route>

        <Route path="/test" element= { <Testing /> } />

        <Route path="*" element={ <Notfound />} />
      </Routes>
    </>
  )
}

export default App