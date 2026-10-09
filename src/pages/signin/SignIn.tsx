import RoleSwitcher from "@/components/dev/RoleSwitcher";
import Sidebar from "@/components/layout/Sidebar";


function SignIn() {

  async function handleSignIn( e: React.SubmitEvent<HTMLFormElement>){
    e.stopPropagation();
  }

  return (
    <div
      className="
        min-h-dvh w-full
        bg-sidebar
        text-text-muted
        flex items-center justify-center
        p-5
      "
    >
      {/* REMOVE AFTER TESTING */}
      <RoleSwitcher />
      <Sidebar/>

      <div
        className="
          w-full max-w-md
          bg-page-background
          rounded-2xl
          border border-black/10
          shadow-2xl
          p-8
        "
      >
        <div className="mb-8">
          <h1
            className="
              text-primary
              font-heading
              text-3xl
              font-semibold
            "
          >
            Sign In
          </h1>

          <p className="text-sm text-text-muted mt-2">
            Sign in to access your revenue dashboard.
          </p>
        </div>

        <form 
        onSubmit={handleSignIn}
        className="flex flex-col gap-5">

          {/* API */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="api"
              className="text-xs font-medium text-text-muted"
            >
              API Endpoint
            </label>

            <input
              id="api"
              type="text"
              placeholder="https://api.example.com"
              className="
                w-full
                h-11
                px-3
                rounded-lg
                bg-white
                border border-black/10
                text-sm text-gray-900
                outline-none
                transition
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-medium text-text-muted"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="
                w-full
                h-11
                px-3
                rounded-lg
                bg-white
                border border-black/10
                text-sm text-gray-900
                outline-none
                transition
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="text-xs font-medium text-text-muted"
              >
                Password
              </label>

              <button
                type="button"
                className="
                  text-xs
                  text-primary
                  hover:underline
                "
              >
                Forgot password?
              </button>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="
                w-full
                h-11
                px-3
                rounded-lg
                bg-white
                border border-black/10
                text-sm text-gray-900
                outline-none
                transition
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
              "
            />
          </div>

          <button
            type="button"
            className="
              w-full
              h-11
              mt-2
              rounded-lg
              bg-primary
              text-white
              text-sm
              font-medium
              transition
              hover:opacity-90
              active:scale-[0.98]
            "
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-7">
          Revenue management & analytics
        </p>
      </div>
    </div>
  );
}

export default SignIn;