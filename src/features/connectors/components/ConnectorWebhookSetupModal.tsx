import toast from "react-hot-toast";

interface ConnectorWebhookSetupModalProps {
  webhookUrl: string;
  webhookSecret: string;
  onClose: () => void;
}

export default function ConnectorWebhookSetupModal({
  webhookUrl,
  webhookSecret,
  onClose,
}: ConnectorWebhookSetupModalProps) {
  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied.");
    } catch (error) {
      console.error("Failed to copy webhook URL:", error);
      toast.error("Unable to copy the webhook URL.");
    }
  };

  const downloadSecret = () => {
    const file = new Blob([webhookSecret], {
      type: "text/plain;charset=utf-8",
    });
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "connector-webhook-secret.txt";
    link.click();
    URL.revokeObjectURL(fileUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="connector-webhook-setup-title"
        className="w-full max-w-lg rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <h2
          id="connector-webhook-setup-title"
          className="font-heading text-xl font-semibold"
        >
          Connector saved
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Use this URL as the provider webhook endpoint. Keep your webhook
          secret secure.
        </p>

        <label
          htmlFor="connector-webhook-url"
          className="mt-5 block text-xs font-medium text-text-muted"
        >
          Webhook URL
        </label>
        <code
          id="connector-webhook-url"
          className="mt-2 block break-all rounded-lg border border-border bg-surface-muted p-3 text-xs text-text"
        >
          {webhookUrl}
        </code>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => void copyWebhookUrl()}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-surface-muted"
          >
            <i className="fi fi-rr-copy" aria-hidden="true" />
            Copy URL
          </button>
          <button
            type="button"
            onClick={downloadSecret}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            <i className="fi fi-rr-download" aria-hidden="true" />
            Download secret
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-surface-muted"
          >
            Done
          </button>
        </div>
      </section>
    </div>
  );
}
