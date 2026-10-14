import { getMe, loginUser } from "@/services/authService";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/store/slices/authSlice";

interface ISignInData {
  api?: string,
  email: string;
  password: string;
}

function SignIn() {

  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<ISignInData>({
    api: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(formData);
      console.log(result)
      const user = await getMe();
      dispatch(setCredentials(user))
      
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = "h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-text placeholder:text-slate-400 focus:border-primary";
  const labelClass = "text-sm font-medium text-text";

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-page-background px-4 py-10 text-text sm:px-6">
      <main className="w-full max-w-md rounded-2xl border border-border bg-card px-6 py-9 sm:px-10 sm:py-10">
        <div className="w-full">
          {/* Brand */}
          <div className="mb-12">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Ledger<span className="text-text-muted">.</span>
            </h1>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-muted">
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
                  className="text-xs font-medium text-text-muted transition hover:text-primary"
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
                className="text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-text underline underline-offset-4 decoration-neutral-300 hover:decoration-text"
              >
                Create account
              </Link>
            </p>
          </div>

          <div className="mt-10 border-t border-border pt-5">
            <p className="text-center text-xs text-text-muted">
              Revenue management & analytics
            </p>
          </div>

          {/* Temporary development helper — remove in production */}
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => void getMe()}
              className="mt-5 text-xs text-text-muted underline hover:text-primary"
            >
              Test session
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default SignIn;