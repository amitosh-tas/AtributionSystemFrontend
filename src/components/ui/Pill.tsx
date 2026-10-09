interface IPill {
  name: string;
  variant?: "direct" | "google" | "awin" | "chatgpt" | "klaviyo" | "default";
}

const variants = {
  direct: "bg-[#DCE8E9] text-[#376A70]",
  google: "bg-[#F1DDD3] text-[#A95532]",
  awin: "bg-[#E4E9DF] text-[#697D5C]",
  chatgpt: "bg-[#DCEBF1] text-[#357B9B]",
  klaviyo: "bg-[#F3E0E5] text-[#B85470]",
  default: "bg-gray-100 text-gray-700",
};

function Pill({ name, variant = "default" }: IPill) {
  return (
    <span
      className={[
        "inline-flex w-fit items-center gap-2",
        "whitespace-nowrap rounded-full px-3 py-1",
        "text-xs font-medium",
        variants[variant],
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full bg-current opacity-90"
      />
      {name}
    </span>
  );
}

export default Pill;