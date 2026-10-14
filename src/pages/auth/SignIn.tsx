import { getMe, loginUser } from "@/services/authService";
import { useState } from "react";
import { Link } from "react-router-dom";

import bg from "@/assets/bg1.png";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import GlassSurface from "@/components/GlassSurface";

interface ISignInData {
  api?: string;
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
      console.log(result);
      const user = await getMe();
      dispatch(setCredentials(user));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = `
    w-full rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3
    text-sm text-slate-100 placeholder:text-slate-400
    outline-none transition-all duration-200
    focus:border-sky-400/50 focus:bg-slate-950/40 focus:ring-2 focus:ring-sky-500/20
  `;

  const labelClass = "text-sm font-medium text-slate-200";

  return (
    <div className="relative flex min-h-dvh w-full overflow-hidden bg-[#050d16] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_28%)]" />

      <main className="relative z-10 flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-[42%]">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={30}
          borderWidth={0.8}
          displace={0.2}
          backgroundOpacity={0.12}
          opacity={0.96}
          blur={16}
          saturation={1.15}
          redOffset={0}
          greenOffset={2}
          blueOffset={8}
          refraction
          renderer="auto"
          className="w-full max-w-md"
        >
          <div className="w-full rounded-[inherit] border border-white/10 bg-slate-950/40 p-6 sm:p-8">
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-50">
                Ledger<span className="text-sky-300">.</span>
              </h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Sign in to access your revenue dashboard.</p>
            </div>

            <form onSubmit={handleSignIn} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="api-url" className={labelClass}>API URL</label>
                <input
                  id="api-url"
                  name="api"
                  type="url"
                  autoComplete="off"
                  placeholder="https://api.example.com"
                  value={formData.api}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      api: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={labelClass}>Email address</label>
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
                  <label htmlFor="password" className={labelClass}>Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      // Connect your forgot-password flow here.
                    }}
                    className="text-xs text-slate-400 transition hover:text-sky-200"
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

              {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-12 w-full rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(96,165,250,0.45)] transition-opacity duration-200 hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Don’t have an account?{" "}
                <Link to="/signup" className="font-medium text-sky-200 underline underline-offset-4 decoration-sky-400/40 hover:decoration-sky-300">
                  Create account
                </Link>
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-5">
              <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Revenue management & analytics
              </p>
            </div>

            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={() => void getMe()}
                className="mt-5 text-xs text-slate-400 underline decoration-slate-400/50 underline-offset-4 hover:text-sky-200"
              >
                Test session
              </button>
            )}
          </div>
        </GlassSurface>
      </main>

      <aside className="sticky top-0 hidden h-dvh overflow-hidden lg:block lg:flex-1">
        <img src={bg} alt="" className="h-full w-full object-cover opacity-80" />
      </aside>
    </div>
  );
}

export default SignIn;