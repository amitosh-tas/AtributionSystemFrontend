import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

interface DataTableProps<T> {
  tableHead?: string;
  tableSubHead?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  tableHead,
  tableSubHead,
  columns,
  data,
  getRowKey,
  emptyMessage = "No data available.",
  onRowClick,
}: DataTableProps<T>) {
  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="w-full overflow-x-auto bg-card px-4 rounded-xl border-2 border-border shadow">
      <div
      className="flex justify-between items-end px-4 pt-4">
        { tableHead && 
        <p
        className="font-heading font-medium">
          {tableHead}
        </p> 
        }
        {
          tableSubHead &&
          <p
          className="text-[10px] text-text-muted">
            {tableSubHead}
          </p>
        }
      </div>
      <table className="w-full min-w-150 border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={[
                  "px-4 py-3 text-[10px] font-semibold uppercase",
                  "tracking-wide text-text-muted",
                  alignment[column.align ?? "left"],
                  column.className ?? "",
                ].join(" ")}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={[
                  "border-b border-border last:border-b-0",
                  "transition-colors hover:bg-surface-muted/50",
                  onRowClick
                    ? "cursor-pointer focus-within:bg-surface-muted/50"
                    : "",
                ].join(" ")}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={[
                      "px-4 py-3.5 align-middle",
                      alignment[column.align ?? "left"],
                      column.className ?? "",
                    ].join(" ")}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
