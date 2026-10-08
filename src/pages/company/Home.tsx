import PageLayout from "@/components/layout/PageLayout"
import Card from "@/components/ui/Card"
import AnalyticsGrid from "@/features/analytics/components/AnalyticsGrid"
import RevenueLedger from "@/features/revenue/components/RevenueLedger"
import RevenueLedgerChart from "@/features/revenue/components/RevenueLedgerChart"


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
        
        <AnalyticsGrid>
          <Card 
            title="new customers"
            value="383"
            description="company-wide"
          />
          
          <Card 
            title="new customers"
            value="383"
            description="company-wide"
          />
          
          <Card 
            title="new customers"
            value="383"
            description="company-wide"
          />
          
          <Card 
            title="new customers"
            value="383"
            description="company-wide"
          />

        </AnalyticsGrid>


      </PageLayout>

    </>
  )
}

export default Home