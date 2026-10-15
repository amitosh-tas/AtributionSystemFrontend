import PageLayout from "@/components/layout/PageLayout"
import EmptyState from "@/components/ui/EmptyState"
import { getCustomers } from "@/services/companyServices"
import { useEffect } from "react"



function Customers() {

  useEffect(()=>{
    const api = async() => {
      console.log(await getCustomers("pk_test_MFug-NcERchZ2cHupE8-EwwZpKDtWkPYaxZladwla1U"))
    }

    api();
  }, [])

  return (
    <>
    <PageLayout
    title="Customers"
    headTitle="Audience"
    description="Review customer activity and purchase history."
    >
      <EmptyState
        title="Customer data is not connected yet"
        description="Customer profiles and purchase activity will appear here when this workspace provides customer data."
      />
    </PageLayout>
    </>
  )
}

export default Customers