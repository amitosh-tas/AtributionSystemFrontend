interface IAnalytics {
  revenue?: number;
  tax?: number;
  invoices?: number;
}

function Analytics({ revenue = 0, tax = 30, invoices = 0 }: IAnalytics) {
  const taxed = revenue * (tax / 100);
  const revenueAfterTax = revenue - taxed;

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="font-heading text-5xl font-semibold tracking-tight text-slate-50 md:text-6xl">
          {currency.format(revenue)}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
          {currency.format(revenueAfterTax)} excl tax · {currency.format(taxed)} tax
        </p>
      </div>

      <div className="max-w-xl text-sm leading-6 text-slate-400">
        Company-wide revenue, all locations combined, across {invoices} invoices.
      </div>
    </div>
  );
}

export default Analytics;