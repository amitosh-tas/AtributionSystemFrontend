import PageLayout from "@/components/layout/PageLayout"
import { getCompanyKey } from "@/services/apiService"
import { useEffect } from "react"




function ApiKeys() {

  useEffect(()=>{
    console.log( getCompanyKey());
  })

  return (
    <>
    <PageLayout
    title="API Keys"
    headTitle="Manage and view keys"
    >
      <p>test</p>
    </PageLayout>
    </>
  )
}

export default ApiKeys