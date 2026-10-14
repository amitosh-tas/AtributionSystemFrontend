import PageLayout from "@/components/layout/PageLayout"
import EmptyState from "@/components/ui/EmptyState"
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
    description="Review API access for platform integrations."
    >
      <EmptyState
        title="Platform API key management is not available yet"
        description="Platform API keys will appear here when platform-level key management is connected."
      />
    </PageLayout>
    </>
  )
}

export default ApiKeys