import bgWallpaper from "@/assets/bg_wallpaper.jpg";

export default function DashboardBackground() {
  return (
    <div className="fixed inset-0 z-0 h-dvh w-full overflow-hidden bg-[#040b13]">
      {/* Previous animated background kept commented out for reference:
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_25%),linear-gradient(180deg,#040b13_0%,#071d2b_100%)]" />
      <FluxLines ... />
      */}

      <img
        src={bgWallpaper}
        alt=""
        className="h-full w-full object-cover scale-[1.03] opacity-75 grayscale-[0.08] contrast-[0.85]"
      />

      <div className="absolute inset-0 bg-slate-950/15" />
    </div>
  );
}