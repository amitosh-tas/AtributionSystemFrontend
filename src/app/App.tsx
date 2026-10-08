
import { Routes, Route } from "react-router-dom"
import Notfound from "@/components/ui/Notfound"
import Testing from "@/test/Testing"
import Main from "../components/ui/Main"
import Home from "../pages/Home"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element= {<Main/>}>
          <Route index element={<Home />} />
          
        </Route>

        <Route path="/test" element= { <Testing /> } />

        <Route path="*" element={ <Notfound />} />
      </Routes>
    </>
  )
}

export default App