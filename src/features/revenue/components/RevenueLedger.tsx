import type { ReactNode } from "react";

interface RevenueLedgerProps {
  children: ReactNode;
}

function RevenueLedger({ children }: RevenueLedgerProps) {
  return (
    <div
      className="
        p-5
        bg-card
        border-2 border-border
        text-text-muted
        rounded-xl
        shadow
      "
    >
      <div className="text-[10px] uppercase flex justify-between">
        <p>Revenue Ledger - By Source</p>

        <p>Rs Total</p>
      </div>

      <div className="bg-black/15 w-full h-px my-2.5" />

      {children}

      <div className="bg-black/15 w-full h-px my-2.5" />
    </div>
  );
}

export default RevenueLedger;