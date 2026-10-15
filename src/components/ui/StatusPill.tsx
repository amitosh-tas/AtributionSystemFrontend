type Status =
  | "ACTIVE"
  | "PENDING"
  | "SUSPENDED"
  | "DEACTIVE"
  | "ONGOING"
  | "CLOSED"
  | "OPEN";

interface StatusPillProps {
  status: Status;
}

const statusStyles: Record<Status, string> = {
  ACTIVE:    "bg-success/10 text-success ring-1 ring-inset ring-success/30",
  PENDING:   "bg-warning/10 text-warning ring-1 ring-inset ring-warning/30",
  SUSPENDED: "bg-danger/10 text-danger ring-1 ring-inset ring-danger/30",
  DEACTIVE:  "bg-text-muted/10 text-text-muted ring-1 ring-inset ring-text-muted/20",
  ONGOING:   "bg-primary/10 text-primary ring-1 ring-inset ring-primary/30",
  CLOSED:    "bg-border text-text-muted ring-1 ring-inset ring-border",
  OPEN:      "bg-success/10 text-success ring-1 ring-inset ring-success/30",
};

function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`inline-flex w-max items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {/* <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" /> */}
      {status}
    </span>
  );
}

export default StatusPill;