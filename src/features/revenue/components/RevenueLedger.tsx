import type { ReactNode } from "react";
import GlassSurface from "@/components/GlassSurface";

interface RevenueLedgerProps {
  children: ReactNode;
}

function RevenueLedger({ children }: RevenueLedgerProps) {
  return (
    <GlassSurface
      width="100%"
      height="100%"
      borderRadius={26}
      borderWidth={0.8}
      displace={0.2}
      backgroundOpacity={0.12}
      opacity={0.96}
      blur={14}
      saturation={1.1}
      redOffset={0}
      greenOffset={4}
      blueOffset={8}
      refraction
      renderer="auto"
      className="w-full"
    >
      <div className="w-full rounded-[inherit] bg-slate-950/10 p-5 text-slate-300">
        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          <p>Revenue Ledger - By Source</p>
          <p>Rs Total</p>
        </div>

        <div className="my-3 h-px w-full bg-white/10" />
        {children}
        <div className="mt-3 h-px w-full bg-white/10" />
      </div>
    </GlassSurface>
  );
}

export default RevenueLedger;