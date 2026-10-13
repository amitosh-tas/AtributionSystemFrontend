import PageLayout from "@/components/layout/PageLayout"
import DataTable from "@/components/ui/DataTable"
import InviteCard from "@/components/ui/InviteCard"



function Members() {
  return (
    <>
    <PageLayout
    title="Members"
    headTitle="Invite and manage members"
    >
      <InviteCard/>

      {/* <DataTable 
        tableHead="Everyone with Access"
      /> */}
    </PageLayout>
    </>
  )
}

export default Members