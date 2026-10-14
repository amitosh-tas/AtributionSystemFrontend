import PageLayout from "@/components/layout/PageLayout"
import EmptyState from "@/components/ui/EmptyState"



function Companies() {
  return (
    <>
      <PageLayout
      title="Companies"
      headTitle="companies"
      description="Manage company workspaces across Ledger."
      >
        <EmptyState
          title="Company data is not connected yet"
          description="Company workspaces will be listed here when platform data is available."
        />
      </PageLayout>
    </>
  )
}

export default Companies