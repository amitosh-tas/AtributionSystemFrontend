import PageLayout from "@/components/layout/PageLayout"
import InviteCard from "@/components/ui/InviteCard"



function Team() {
  return (
    <>
      <PageLayout
      headTitle="access"
      title="Team"
      description="Invite teammates and manage access to this workspace."
      >
        <InviteCard/>
      </PageLayout>
    </>
  )
}

export default Team