type Status =
  | "ACTIVE"
  | "PENDING"
  | "DEACTIVE"
  | "ONGOING"
  | "CLOSED"
  | "OPEN";

interface StatusPillProps {
  status: Status;
}

const statusStyles: Record<Status, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  DEACTIVE: "bg-red-100 text-red-700",
  ONGOING: "bg-blue-100 text-blue-700",
  CLOSED: "bg-gray-100 text-gray-700",
  OPEN: "bg-teal-100 text-teal-700",
};

function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold w-max ${statusStyles[status]}`}
    >
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default StatusPill;