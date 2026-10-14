
import PageLayout from "@/components/layout/PageLayout";
import EmptyState from "@/components/ui/EmptyState";

function Settings() {
  return (
    <PageLayout
      title="Platform settings"
      headTitle="Configuration"
      description="Configure platform-level preferences."
    >
      <EmptyState
        icon="fi-rr-settings"
        title="Platform settings are not available yet"
        description="Settings will be shown here when platform configuration is connected."
      />
    </PageLayout>
  );
}

export default Settings