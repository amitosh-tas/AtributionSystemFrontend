import PageLayout from "@/components/layout/PageLayout"
import EmptyState from "@/components/ui/EmptyState"



function Campaign() {
  return (
    <>
      <PageLayout
      headTitle="attribution"
      title="Campaigns"
      description="Understand how your campaigns contribute to revenue."
      >
        <EmptyState
          icon="fi-rr-bullseye"
          title="Campaign reporting is not connected yet"
          description="Campaign performance will appear here when campaign data is available for this workspace."
        />
      </PageLayout>
    </>
  )
}

export default Campaign