import PageLayout from "@/components/layout/PageLayout"
import RevenueLedger from "@/features/companyDashboard/components/RevenueLedgerCard"


function Home() {
  return (
    <>
      <PageLayout
      companyName="TAS"
      title="Master Report"
      description="Everything in one place — company-wide totals or a single location, any date range."
      >
        <RevenueLedger/>
        <p>Testing</p>
      </PageLayout>

    </>
  )
}

export default Home