
import { Routes, Route } from "react-router-dom"
import Notfound from "@/components/ui/Notfound"
import Testing from "@/test/Testing"
import Home from "./components/ui/Home"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element= {<Home/>}>

          
        </Route>

        <Route path="/test" element= { <Testing /> } />

        <Route path="*" element={ <Notfound />} />
      </Routes>
    </>
  )
}

export default App