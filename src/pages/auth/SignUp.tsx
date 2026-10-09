import { useState } from "react";
import { Link } from "react-router-dom";
import bg from "@/assets/bg1.png";

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
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  country: string;
  industry: string;
  timezone: string;
  dataRegion: string;
  currency: string;
  paymentMethod: string;
}

const initialForm: SignUpForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  country: "IN",
  industry: "",
  timezone: "Asia/Kolkata",
  dataRegion: "IN",
  currency: "INR",
  paymentMethod: "",
};

const inputClass = `
  w-full min-w-0 bg-transparent py-3
  border-0 border-b border-gray-300
  rounded-none
  text-sm text-black
  placeholder:text-gray-400
  outline-none
  transition-colors duration-200
  focus:border-black
  focus:ring-0
`;

const labelClass = "text-sm font-medium text-gray-800";

const sectionTitleClass = "text-base font-semibold tracking-tight text-black";

const sectionDescriptionClass = "mt-1 text-sm leading-6 text-gray-500";

function SignUp() {
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

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
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
        companyName: form.companyName.trim(),
        country: form.country,
        industry: form.industry,
        timezone: form.timezone,
        dataRegion: form.dataRegion,
        currency: form.currency,
        paymentMethod: form.paymentMethod.trim(),
      };

      console.log("Signup payload:", payload);
      setError("Signup API is not connected yet.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh w-full bg-white text-black">
      <div className="flex min-h-dvh w-full">
        {/* Form panel */}
        <main className="flex w-full justify-center px-6 py-12 sm:px-10 lg:w-[55%] lg:px-12 xl:px-20">
          <div className="w-full max-w-xl">
            {/* Brand */}
            <div className="mb-10">
              <Link
                to="/signin"
                className="font-heading text-2xl font-semibold tracking-tight"
              >
                Ledger<span className="text-gray-400">.</span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-10">
              <h1 className="text-3xl font-semibold tracking-tight">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
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
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
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

              <div className="h-px bg-gray-200" />

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
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    placeholder="Your company name"
                    required
                    value={form.companyName}
                    onChange={(e) =>
                      updateField("companyName", e.target.value)
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

              <div className="h-px bg-gray-200" />

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
                    <p className="text-xs leading-5 text-gray-400">
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
                  className="border-l-2 border-red-600 pl-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-1 h-12 w-full
                  bg-black text-white
                  text-sm font-medium
                  transition-colors duration-200
                  hover:bg-gray-800
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-medium text-black underline underline-offset-4 decoration-gray-300 hover:decoration-black"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-5">
              <p className="text-center text-xs text-gray-400">
                Revenue management &amp; analytics
              </p>
            </div>
          </div>
        </main>

        {/* Image panel */}
        <aside className="hidden sticky top-0 h-full overflow-hidden lg:block lg:w-[45%]">
          <img
            src={bg}
            alt=""
            className=" h-dvh w-full object-cover sticky top-0"
          />
        </aside>
      </div>
    </div>
  );
}

export default SignUp;