import PageLayout from "@/components/layout/PageLayout"
import AvgOrderValueTrend from "@/features/analytics/components/AvgOrderValueTrend"
import NewCustomersTrend from "@/features/analytics/components/NewCustomerTrend"



function Analytics() {
  return (
    <>
    <PageLayout
    title="Analytics"
    headTitle="TAS"
    description="Trends over time and period-over-period comparisons — for raw numbers, see the Dashboard."
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AvgOrderValueTrend />
        <NewCustomersTrend />
      </div>
    </PageLayout>
    </>
  )
}

export default Analytics