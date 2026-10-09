import { getMe, loginUser } from "@/services/authService";
import { useState } from "react";
import { Link } from "react-router-dom";

import bg from "@/assets/bg1.png";

interface ISignInData {
  api?: string,
  email: string;
  password: string;
}

function SignIn() {
  const [formData, setFormData] = useState<ISignInData>({
    api: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(formData);
      console.log(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = `
    w-full bg-transparent py-3
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

  return (
    <div className="flex min-h-dvh w-full bg-page-background text-black">
      {/* Sign-in form */}
      <main className="flex w-full items-center justify-center px-7 py-12 sm:px-12 lg:w-[30%]">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="mb-12">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Ledger<span className="text-gray-400">.</span>
            </h1>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Sign in to access your revenue dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="flex flex-col gap-7">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={labelClass}>
                Api Url
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="https://api.example.com"
                // required
                value={formData.api}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => {
                    // Connect your forgot-password flow here.
                  }}
                  className="text-xs text-gray-500 transition hover:text-black"
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="
                mt-2 h-12 w-full
                bg-black text-white
                text-sm font-medium
                transition-colors duration-200
                hover:bg-gray-800
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-black underline underline-offset-4 decoration-gray-300 hover:decoration-black"
              >
                Create account
              </Link>
            </p>
          </div>

          <div className="mt-12 border-t border-gray-100 pt-5">
            <p className="text-center text-xs text-gray-400">
              Revenue management & analytics
            </p>
          </div>

          {/* Temporary development helper — remove in production */}
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => void getMe()}
              className="mt-5 text-xs text-gray-400 underline hover:text-black"
            >
              Test session
            </button>
          )}
        </div>
      </main>

      {/* Image panel */}
      <aside className="sticky top-0 h-dvh hidden overflow-hidden lg:block lg:flex-1">
        <img
          src={bg}
          alt=""
          className="h-full w-full object-cover"
        />
      </aside>
    </div>
  );
}

export default SignIn;