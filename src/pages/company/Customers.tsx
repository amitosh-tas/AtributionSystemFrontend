import PageLayout from "@/components/layout/PageLayout"
import EmptyState from "@/components/ui/EmptyState"



function Customers() {
  return (
    <>
    <PageLayout
    title="Customers"
    headTitle="Audience"
    description="Review customer activity and purchase history."
    >
      <EmptyState
        icon="fi-rr-users"
        title="Customer data is not connected yet"
        description="Customer profiles and purchase activity will appear here when this workspace provides customer data."
      />
    </PageLayout>
    </>
  )
}

export default Customers