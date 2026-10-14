interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export default function EmptyState({
  title,
  description,
  icon = "fi-rr-inbox",
}: EmptyStateProps) {
  return (
    <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-12 text-center">
      <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-slate-100 text-lg text-text-muted">
        <i aria-hidden="true" className={`fi ${icon}`} />
      </span>
      <h2 className="font-heading text-base font-semibold tracking-tight text-text">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
        {description}
      </p>
    </section>
  );
}
