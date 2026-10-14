import { useState } from "react";
import { Link } from "react-router-dom";
import { registerCompany } from "@/services/authService";
import { restoreSession } from "@/services/restoreSession";
import { useAppDispatch } from "@/app/hooks";

const INDUSTRIES = [
  "E-commerce & Retail",
  "SaaS & Technology",
  "Marketing & Advertising",
  "Finance & Banking",
  "Healthcare",
  "Manufacturing",
  "Education",
  "Travel & Hospitality",
  "Professional Services",
  "Other",
];

const COUNTRIES = [
  { name: "India", code: "IN", currency: "INR", timezone: "Asia/Kolkata" },
  {
    name: "United States",
    code: "US",
    currency: "USD",
    timezone: "America/New_York",
  },
  {
    name: "United Kingdom",
    code: "GB",
    currency: "GBP",
    timezone: "Europe/London",
  },
  { name: "Germany", code: "DE", currency: "EUR", timezone: "Europe/Berlin" },
  { name: "France", code: "FR", currency: "EUR", timezone: "Europe/Paris" },
  { name: "Canada", code: "CA", currency: "CAD", timezone: "America/Toronto" },
  {
    name: "Australia",
    code: "AU",
    currency: "AUD",
    timezone: "Australia/Sydney",
  },
  {
    name: "Singapore",
    code: "SG",
    currency: "SGD",
    timezone: "Asia/Singapore",
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    currency: "AED",
    timezone: "Asia/Dubai",
  },
  { name: "Japan", code: "JP", currency: "JPY", timezone: "Asia/Tokyo" },
];

const CURRENCIES = [
  { code: "INR", label: "INR — Indian Rupee (₹)" },
  { code: "USD", label: "USD — US Dollar ($)" },
  { code: "EUR", label: "EUR — Euro (€)" },
  { code: "GBP", label: "GBP — British Pound (£)" },
  { code: "CAD", label: "CAD — Canadian Dollar (C$)" },
  { code: "AUD", label: "AUD — Australian Dollar (A$)" },
  { code: "SGD", label: "SGD — Singapore Dollar (S$)" },
  { code: "AED", label: "AED — UAE Dirham" },
  { code: "JPY", label: "JPY — Japanese Yen (¥)" },
];

const DATA_REGIONS = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "EU", label: "European Union" },
  { value: "UK", label: "United Kingdom" },
  { value: "APAC", label: "Asia Pacific" },
];

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Toronto",
  "Australia/Sydney",
  "UTC",
];

interface SignUpForm {
  adminName: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  country: string;
  industry: string;
  timezone: string;
  dataRegion: string;
  currency: string;
  paymentMethod: string;
}

const initialForm: SignUpForm = {
  adminName: "",
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  country: "IN",
  industry: "",
  timezone: "Asia/Kolkata",
  dataRegion: "IN",
  currency: "INR",
  paymentMethod: "",
};

const inputClass = `
  h-11 w-full min-w-0 rounded-lg border border-border
  bg-white px-3 text-sm text-text placeholder:text-slate-400
`;

const labelClass = "text-sm font-medium text-text";

const sectionTitleClass = "font-heading text-base font-semibold tracking-tight text-text";

const sectionDescriptionClass = "mt-1 text-sm leading-6 text-text-muted";

function SignUp() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<SignUpForm>(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof SignUpForm>(
    field: K,
    value: SignUpForm[K],
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
  }

  function handleCountryChange(countryCode: string) {
    const country = COUNTRIES.find((item) => item.code === countryCode);

    setForm((previous) => ({
      ...previous,
      country: countryCode,
      currency: country?.currency ?? previous.currency,
      timezone: country?.timezone ?? previous.timezone,
    }));

    setError("");
  }

  async function handleSignUp(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Connect this to your backend signup endpoint.
      // Never send confirmPassword to the backend.
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        adminName: form.adminName.trim(),
        country: form.country,
        timezone: form.timezone,
        currency: form.currency,
        industry: form.industry,
        dataRegion: form.dataRegion,
        paymentMethod: form.paymentMethod.trim(),
      };

      console.log("Signup payload:", payload);

      const result = await registerCompany(payload);

      await restoreSession(dispatch);

      console.log("Company registered successfully:", result);

    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh w-full bg-page-background px-4 py-8 text-text sm:px-6 sm:py-12">
      <main className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card px-5 py-8 sm:px-10 sm:py-10">
          <div className="w-full">
            {/* Brand */}
            <div className="mb-10">
              <Link
                to="/signin"
                className="font-heading text-2xl font-bold tracking-tight"
              >
                Ledger<span className="text-primary">.</span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-10">
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-text-muted">
                Set up your company workspace and start tracking revenue.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="flex flex-col gap-9">
              {/* Account details */}
              <section className="flex flex-col gap-5">
                <div>
                  <h2 className={sectionTitleClass}>Account details</h2>
                  <p className={sectionDescriptionClass}>
                    Your personal login information.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className={labelClass}>
                      Full name *
                    </label>
                    <input
                      id="adminName"
                      name="adminName"
                      type="text"
                      autoComplete="adminName"
                      placeholder="Your full name"
                      required
                      value={form.adminName}
                      onChange={(e) => updateField("adminName", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className={labelClass}>
                      Work email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      required
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className={labelClass}>
                      Password *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Minimum 8 characters"
                      minLength={8}
                      required
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className={labelClass}>
                      Confirm password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      minLength={8}
                      required
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              <div className="h-px bg-border" />

              {/* Company details */}
              <section className="flex flex-col gap-5">
                <div>
                  <h2 className={sectionTitleClass}>Company details</h2>
                  <p className={sectionDescriptionClass}>
                    Tell us about the business you're managing.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="companyName" className={labelClass}>
                    Company name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="organization"
                    placeholder="Your company name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="country" className={labelClass}>
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={form.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className={inputClass}
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="industry" className={labelClass}>
                      Industry *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      required
                      value={form.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      className={inputClass}
                    >
                      <option value="" disabled>
                        Select industry
                      </option>
                      {INDUSTRIES.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <div className="h-px bg-border" />

              {/* Regional configuration */}
              <section className="flex flex-col gap-5">
                <div>
                  <h2 className={sectionTitleClass}>
                    Regional configuration
                  </h2>
                  <p className={sectionDescriptionClass}>
                    Configure how revenue and company data are handled.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="timezone" className={labelClass}>
                    Timezone *
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    required
                    value={form.timezone}
                    onChange={(e) => updateField("timezone", e.target.value)}
                    className={inputClass}
                  >
                    {TIMEZONES.map((timezone) => (
                      <option key={timezone} value={timezone}>
                        {timezone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="dataRegion" className={labelClass}>
                      Data region *
                    </label>
                    <select
                      id="dataRegion"
                      name="dataRegion"
                      required
                      value={form.dataRegion}
                      onChange={(e) =>
                        updateField("dataRegion", e.target.value)
                      }
                      className={inputClass}
                    >
                      {DATA_REGIONS.map((region) => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs leading-5 text-text-muted">
                      Availability depends on your backend infrastructure.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="currency" className={labelClass}>
                      Reporting currency *
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      required
                      value={form.currency}
                      onChange={(e) => updateField("currency", e.target.value)}
                      className={inputClass}
                    >
                      {CURRENCIES.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Payment method */}
              <div className="flex flex-col gap-2">
                <label htmlFor="paymentMethod" className={labelClass}>
                  Payment method
                </label>
                <input
                  id="paymentMethod"
                  name="paymentMethod"
                  type="text"
                  placeholder="e.g. Stripe, PayPal, Razorpay"
                  value={form.paymentMethod}
                  onChange={(e) =>
                    updateField("paymentMethod", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="border-l-2 border-red-600 pl-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-text-muted">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-semibold text-primary underline underline-offset-4 decoration-indigo-200 hover:decoration-primary"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-8 border-t border-border pt-5">
              <p className="text-center text-xs text-text-muted">
                Revenue management &amp; analytics
              </p>
            </div>
          </div>
      </main>
    </div>
  );
}

export default SignUp;