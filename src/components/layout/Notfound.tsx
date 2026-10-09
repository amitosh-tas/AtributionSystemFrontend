import { Link } from "react-router-dom";

function Notfound() {
  return (
    <div className="
      min-h-dvh w-full
      bg-page-background
      text-text-muted
      flex items-center justify-center
      px-6 py-12
    ">
      <div className="w-full max-w-lg text-center">

        {/* Brand */}
        <p className="
          font-heading
          text-sm
          uppercase
          tracking-[0.3em]
          text-primary
          mb-10
        ">
          Ledger
        </p>

        {/* 404 */}
        <div className="relative mb-6">
          <h1 className="
            font-heading
            text-[140px]
            sm:text-[180px]
            leading-none
            font-medium
            tracking-tight
            text-primary/15
            select-none
          ">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="
              inline-flex items-center
              rounded-full
              border border-primary/20
              bg-page-background
              px-4 py-2
              text-xs
              uppercase
              tracking-[0.2em]
              text-primary
            ">
              Page not found
            </span>
          </div>
        </div>

        {/* Message */}
        <h2 className="
          font-heading
          text-3xl
          sm:text-4xl
          font-medium
          text-primary
          tracking-tight
        ">
          A little off the books.
        </h2>

        <p className="
          mt-4
          mx-auto
          max-w-sm
          text-sm
          leading-7
          text-text-muted
        ">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to where the numbers make sense.
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-8">
          <div className="h-px w-12 bg-primary/20" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
          <div className="h-px w-12 bg-primary/20" />
        </div>

        {/* Home Button */}
        <Link
          to="/"
          className="
            inline-flex items-center justify-center
            gap-3
            rounded-lg
            bg-primary
            px-6 py-3
            text-sm
            font-medium
            text-white
            transition-all
            duration-200
            hover:opacity-90
            hover:-translate-y-0.5
            active:translate-y-0
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary/40
            focus-visible:ring-offset-2
          "
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </Link>

        {/* Footer */}
        <p className="mt-12 text-[10px] uppercase tracking-[0.2em] opacity-50">
          Revenue management &amp; analytics
        </p>

      </div>
    </div>
  );
}

export default Notfound;