import axios from "axios";
import { useEffect, useState } from "react"


function Testing() {

  const [data, setData] = useState({});


  async function name(link: string) {
    const res = await axios.get(link)

    setData(res);
    
  }


  useEffect( ()=> {
    name("https://airplane-snow-becomes-moderators.trycloudflare.com/click?utm_source=gdlib&utm_campaign=affiliate");
    console.log(data)

  }, [])

  return (
    <div>
      testing

      <pre>
        {

        }
      </pre>

    </div>
  )
}

export default Testing