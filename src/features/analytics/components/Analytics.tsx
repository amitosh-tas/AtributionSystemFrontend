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
    <div className="flex flex-col lg:flex-row items-baseline gap-5">
      <div>
        <p className="text-6xl font-heading">
          {currency.format(revenue)}
        </p>

        <p className="text-text-muted text-xs">
          {currency.format(revenueAfterTax)} excl tax ·{" "}
          {currency.format(taxed)} tax
        </p>
      </div>

      <div className="text-text-muted text-xs max-w-75">
        Company-wide revenue, all locations combined, across{" "}
        {invoices} invoices.
      </div>
    </div>
  );
}

export default Analytics;