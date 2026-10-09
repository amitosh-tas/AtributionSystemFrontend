
import { Routes, Route } from "react-router-dom"
import Notfound from "@/components/layout/Notfound"
import Testing from "@/test/Testing"
import DashboardLayout from "../components/layout/DashboardLayout"
import Overview from "../pages/company/Overview"
import Analytics from "@/pages/company/Analytics"
import Transactions from "@/pages/company/Transactions"
import Customers from "@/pages/company/Customers"
import SignIn from "@/pages/signin/SignIn"
import Team from "@/pages/company/Team"
import Campaign from "@/pages/company/Campaign"
import Upcoming from "@/pages/company/Upcoming"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element= {<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/campaigns" element={<Campaign />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/upcoming" element={<Upcoming />}/>
          <Route path="/team" element={<Team/>} />
        </Route>

        <Route path="/signin" element={<SignIn />} />

        <Route path="/test" element= { <Testing /> } />

        <Route path="*" element={ <Notfound />} />
      </Routes>
    </>
  )
}

export default App