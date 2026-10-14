import PageLayout from "@/components/layout/PageLayout"
import EmptyState from "@/components/ui/EmptyState"


function Dashboard() {
  return (
    <>
    <PageLayout
    headTitle="Platform"
    title="Super Admin"
    description="Manage Ledger workspaces, members, and platform access."
    >
      <EmptyState
        icon="fi-rr-chart-pie"
        title="Platform overview is not connected yet"
        description="Platform-wide metrics will appear here once they are provided by the service."
      />
    </PageLayout>
    </>
  )
}

export default Dashboard