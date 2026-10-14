import type { ReactNode } from "react";
import GlassSurface from "@/components/GlassSurface";

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
  filters?: ReactNode;
}

export default function DataTable<T>({
  tableHead,
  tableSubHead,
  columns,
  data,
  getRowKey,
  emptyMessage = "No data available.",
  onRowClick,
  filters,
}: DataTableProps<T>) {
  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <GlassSurface
      width="100%"
      height="100%"
      borderRadius={20}
      borderWidth={0.05}
      distortionScale={-120}
      displace={0.18}
      backgroundOpacity={0.04}
      opacity={0.94}
      blur={14}
      saturation={1.15}
      redOffset={0}
      greenOffset={4}
      blueOffset={8}
      refraction
      renderer="auto"
      className="h-full w-full overflow-hidden"
    >
      <div className="w-full overflow-hidden rounded-[inherit] bg-slate-950/15">
        {(tableHead || tableSubHead) && (
          <div className="flex flex-col gap-2 px-6 pb-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
            {tableHead && <p className="font-heading text-xl font-medium tracking-tight text-slate-50">{tableHead}</p>}
            {tableSubHead && <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">{tableSubHead}</p>}
          </div>
        )}

        {filters && <div className="px-6 pb-4">{filters}</div>}

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm text-slate-200">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={[
                      "px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400",
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
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={getRowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={[
                      "border-b border-white/5 last:border-b-0",
                      "transition-colors duration-200 hover:bg-white/5",
                      onRowClick ? "cursor-pointer" : "",
                    ].join(" ")}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={[
                          "px-4 py-3.5 align-middle text-slate-200",
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
      </div>
    </GlassSurface>
  );
}