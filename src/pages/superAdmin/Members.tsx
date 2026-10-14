import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import InviteCard from "@/components/ui/InviteCard";

function Members() {
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <PageLayout
      title="Members"
      headTitle="Invite and manage members"
      description="Manage platform members and invite new users."
      actions={
        <button
          type="button"
          onClick={() => setShowInviteForm((show) => !show)}
          aria-expanded={showInviteForm}
          className="flex h-10 items-center gap-2 cursor-pointer rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {/* <i className="fi fi-rr-plus" aria-hidden="true" /> */}
          {showInviteForm ? "Cancel" : "Add member"}
        </button>
      }
    >
      {showInviteForm && <InviteCard />}
    </PageLayout>
  );
}

export default Members;