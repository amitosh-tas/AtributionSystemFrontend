import { useState } from "react";
import { useAppSelector } from "@/app/hooks";

type Role = "platform_admin" | "company_admin" | "company_viewer";

function InviteCard() {
  const currentRole = useAppSelector(
    (state) => state.auth.user?.role
  ) as Role | undefined;

  const isSuperAdmin = currentRole === "platform_admin";
  const isAdmin = currentRole === "company_admin";
  const canInvite = isSuperAdmin || isAdmin;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("company_viewer");
  const [company, setCompany] = useState("");

  // Replace with your actual company data from the API.
  const companies = [
    { id: "1", name: "Company One" },
    { id: "2", name: "Company Two" },
  ];

  const allowedRoles: Role[] = isSuperAdmin
    ? ["platform_admin", "company_admin", "company_viewer"]
    : ["company_admin", "company_viewer"];

  function handleSubmit(e:  React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      name,
      email,
      password,
      role,
      ...(isSuperAdmin && role !== "platform_admin"
        ? { companyId: company }
        : {}),
    };

    // Connect your create-user API here.
    console.log("Invite payload:", payload);
  }

  if (!canInvite) return null;

  return (
    <section className="w-full rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-base font-semibold tracking-tight text-text">
          Invite a teammate
        </h2>

        <p className="text-xs text-text-muted">
          {isSuperAdmin
            ? "Manage users across companies"
            : "Admins manage users · Viewers see the dashboard only"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-text-muted">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="h-10 min-w-0 rounded-lg border border-border bg-card px-3 text-sm text-text placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-text-muted">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="h-10 min-w-0 rounded-lg border border-border bg-card px-3 text-sm text-text placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-text-muted">
            Password
          </label>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="h-10 min-w-0 rounded-lg border border-border bg-card px-3 text-sm text-text placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-text-muted">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="h-10 min-w-0 rounded-lg border border-border bg-card px-3 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          >
            {allowedRoles.map((item) => (
              <option key={item} value={item}>
                {item === "platform_admin"
                  ? "Super Admin"
                  : item === "company_admin"
                    ? "Admin"
                    : "Viewer"}
              </option>
            ))}
          </select>
        </div>

        {isSuperAdmin && role !== "platform_admin" && (
          <div className="flex flex-col gap-2 sm:col-span-2 xl:col-span-1">
            <label className="text-xs font-medium text-text-muted">
              Company
            </label>

            <select
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-10 min-w-0 rounded-lg border border-border bg-card px-3 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              <option value="">Select company</option>
              {companies.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2 xl:col-span-full">
          <button
            type="submit"
            className="h-10 rounded-lg cursor-pointer bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Create user
          </button>
        </div>
      </form>
    </section>
  );
}

export default InviteCard;
