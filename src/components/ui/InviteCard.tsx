import { useState } from "react";
import { useAppSelector } from "@/app/hooks";

type Role = "SUPER_ADMIN" | "ADMIN" | "VIEWER";

function InviteCard() {
  const currentRole = useAppSelector(
    (state) => state.auth.user?.role
  ) as Role | undefined;

  const isSuperAdmin = currentRole === "SUPER_ADMIN";
  const isAdmin = currentRole === "ADMIN";
  const canInvite = isSuperAdmin || isAdmin;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("VIEWER");
  const [company, setCompany] = useState("");

  // Replace with your actual company data from the API.
  const companies = [
    { id: "1", name: "Company One" },
    { id: "2", name: "Company Two" },
  ];

  const allowedRoles: Role[] = ["ADMIN", "VIEWER"];

  function handleSubmit(e:  React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      name,
      email,
      password,
      role,
      ...(isSuperAdmin ? { companyId: company } : {}),
    };

    // Connect your create-user API here.
    console.log("Invite payload:", payload);
  }

  if (!canInvite) return null;

  return (
    <section className="w-full rounded-xl border border-gray-200 bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Invite a teammate
        </h2>

        <p className="text-sm text-gray-500">
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
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="h-13.25 min-w-0 rounded-lg border border-gray-300 bg-transparent px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="h-13.25 min-w-0 rounded-lg border border-gray-300 bg-transparent px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Password
          </label>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="h-13.25 min-w-0 rounded-lg border border-gray-300 bg-transparent px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="h-13.25 min-w-0 rounded-lg border border-gray-300 bg-transparent px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {allowedRoles.map((item) => (
              <option key={item} value={item}>
                {item === "SUPER_ADMIN"
                  ? "Super Admin"
                  : item === "ADMIN"
                    ? "Admin"
                    : "Viewer"}
              </option>
            ))}
          </select>
        </div>

        {isSuperAdmin && (
          <div className="flex flex-col gap-2 sm:col-span-2 xl:col-span-1">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Company
            </label>
            <select
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-13.25 min-w-0 rounded-lg border border-gray-300 bg-transparent px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
            className="h-12.5 rounded-lg bg-gray-950 px-6 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create user
          </button>
        </div>
      </form>
    </section>
  );
}

export default InviteCard;
