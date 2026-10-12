import axios from "axios";
import { useEffect, useState } from "react"
import { useAppSelector } from "@/app/hooks";
import RoleSwitcher from "@/components/dev/RoleSwitcher";


function Testing() {

  const [data, setData] = useState({});
  const user = useAppSelector((state) => state.auth.user);
  

  async function name(link: string) {
    const res = await axios.get(link, {
      withCredentials: true
    })

    setData(res);
  }


  useEffect( ()=> {
    name("https://airplane-snow-becomes-moderators.trycloudflare.com/click?utm_source=gdlib&utm_campaign=affiliate");
  }, [])
  
  useEffect(()=>{
    console.log(data)
  }, [data])

  return (
    <div 
    className="flex items-center justify-center">

      <RoleSwitcher />

      <p>{user ? user.role : "Not logged in"}</p>

      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ratione nobis deserunt ea ipsum beatae non, recusandae corporis perspiciatis atque voluptatum, accusantium, sequi cumque! Corporis consequuntur nulla temporibus ex exercitationem!</p>

      <p>
        idk what to doo... 
      </p>

    </div>
  )
}

export default Testing