import PageLayout from "@/components/layout/PageLayout"
import Card from "@/components/ui/Card"
import Analytics from "@/features/analytics/components/Analytics"
import AnalyticsGrid from "@/features/analytics/components/AnalyticsGrid"
import RevenueLedger from "@/features/revenue/components/RevenueLedger"
import RevenueLedgerChart from "@/features/revenue/components/RevenueLedgerChart"

interface ICardData {
  title: string,
  value: string,
  description: string,
}

const cardData: ICardData[] = [
  {
    title: "New Customers",
    value: "383",
    description: "company-wide",
  },
  {
    title: "Returning Customers",
    value: "74",
    description: "company-wide",
  },
  {
    title: "Retention",
    value: "50.3%",
    description: "1659 of 3297, all-time",
  },
  {
    title: "Tracked Visits",
    value: "2,406",
    description: "company-wide",
  },
  {
    title: "Ad-Attributed Revenue",
    value: "$6,494.72",
    description: "Meta + Google + AWIN only",
  },
  {
    title: "Direct / Organic Revenue",
    value: "$46,221.31",
    description: "walk-ins & untracked",
  },
  {
    title: "Unattributed Revenue",
    value: "$0.00",
    description: "no conversion at all",
  },
  {
    title: "Refunded",
    value: "$-127.32",
    description: "3 refunds · all locations",
  },
];

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
        
        <Analytics 
        revenue={49849.4}
        invoices={144}
        tax={30}
        />

        <AnalyticsGrid>
          {
            cardData.map( ({title, value, description}, index) => (
              <Card
              key={index} 
              title={title}
              value={value}
              description={description}
              />
            ) )
          }
        </AnalyticsGrid>


      </PageLayout>

    </>
  )
}

export default Home