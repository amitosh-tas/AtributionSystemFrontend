import { Link } from "react-router-dom"


function Notfound() {
  return (
    <div
    className="flex flex-col gap-10">
      notfound
      <Link to={"/"} className="text-blue-600 underline">HOME</Link>
    </div>
  )
}

export default Notfound