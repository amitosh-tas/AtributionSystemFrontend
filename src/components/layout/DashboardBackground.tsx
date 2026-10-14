import FluxLines from "../FluxLines";

export default function DashboardBackground() {
  return (
    <div className="bg-black fixed inset-0 z-10 overflow-hidden h-dvh w-full">
      <FluxLines
          colors={["#ffffff","#ffffff","#ffffff"]}
          glow={2}
          rimWidth={0.2}
          lineWidth={1}
          flowDirection="down"
          mouseInteraction
          clickSwirl={false}
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          sharpness={2.5}
          shimmer={1.5}
          mouseStrength={1}
          mouseRadius={0.35}
          intro
          lightMode={false}
      />
    </div>
  );
}