import PageLayout from "@/components/layout/PageLayout"
import RevenueLedger from "@/features/revenue/components/RevenueLedger"
import RevenueLedgerChart from "@/features/revenue/RevenueLedgerChart"


function Home() {
  return (
    <>
      <PageLayout
      companyName="TAS"
      title="Master Report"
      description="Everything in one place — company-wide totals or a single location, any date range."
      >
        <RevenueLedger> 
          <RevenueLedgerChart/>
        </RevenueLedger>
        <p>Testing</p>
      </PageLayout>

    </>
  )
}

export default Home