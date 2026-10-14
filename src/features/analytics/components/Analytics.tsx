interface IAnalytics {
  revenue?: number;
  tax?: number;
  invoices?: number;
}

function Analytics({
  revenue = 0,
  tax = 30,
  invoices = 0,
}: IAnalytics) {

  const taxed = revenue * (tax / 100);
  const revenueAfterTax = revenue - taxed;

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="font-heading text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
          {currency.format(revenue)}
        </p>

        <p className="mt-2 text-sm text-text-muted">
          {currency.format(revenueAfterTax)} excl tax ·{" "}
          {currency.format(taxed)} tax
        </p>
      </div>

      <div className="max-w-64 text-sm leading-6 text-text-muted">
        Company-wide revenue, all locations combined, across{" "}
        <span className="font-medium tabular-nums text-text">{invoices} invoices</span>.
      </div>
    </div>
  );
}

export default Analytics;