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
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  SUSPENDED: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
  DEACTIVE: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  ONGOING: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  CLOSED: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
  OPEN: "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200",
};

function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`inline-flex w-max items-center rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {/* <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" /> */}
      {status}
    </span>
  );
}

export default StatusPill;