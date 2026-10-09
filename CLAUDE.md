# Project Architecture and Code Flow

This document describes the repository as it currently exists. Treat the UI and test data as a frontend prototype; do not assume that an API, production authentication, persistence, or complete super-admin workflows are implemented.

## What this project is

A single-page revenue and attribution dashboard built with React 19, TypeScript, Vite, React Router, Redux Toolkit, Tailwind CSS 4, and Recharts. The frontend currently renders dashboard views using local hard-coded data. It has no general API client or data-fetching layer.

## Runtime and request flow

```text
index.html
  -> src/main.tsx
       -> global styles
       -> Redux Provider (src/store/store.ts)
       -> BrowserRouter
       -> src/app/App.tsx
            -> ScrollToTop
            -> ProtectedRoute checks in-memory Redux user and role
            -> page layout and page
                 -> feature components
                      -> shared UI components
```

- `src/main.tsx` mounts the React application at `#root`, wraps it in the Redux provider and browser router.
- `src/app/App.tsx` owns URL-to-page mapping and nests role gates around protected routes.
- Pages compose layouts, feature-level components, and shared UI. Data is currently defined in page or feature component modules rather than loaded from a backend.
- `src/app/index.css` imports Tailwind and the Flaticon icon font and defines the design tokens. Vite is configured in `vite.config.ts`; the `@/` import alias points to `src/`.

## Routes and access

| URL | Access | Current content |
| --- | --- | --- |
| `/` | `ADMIN`, `VIEWER` | Company overview / master report |
| `/analytics` | `ADMIN`, `VIEWER` | Order value and new customer trend charts |
| `/campaigns` | `ADMIN`, `VIEWER` | Campaign placeholder |
| `/customers` | `ADMIN`, `VIEWER` | Customer placeholder |
| `/transactions` | `ADMIN`, `VIEWER` | Transaction placeholder |
| `/upcoming` | `ADMIN`, `VIEWER` | Upcoming bookings placeholder |
| `/team` | `ADMIN` | Team placeholder |
| `/super` | `SUPER_ADMIN` | Super-admin dashboard placeholder |
| `/signin` | Public | Sign-in form UI and development role switcher |
| `/test` | Public | Axios request test page and development role switcher |
| `/unauthorized` | Public | Unauthorized placeholder |
| `*` | Public | Not-found page |

`ProtectedRoute` checks whether a Redux user exists, redirects missing users to `/signin`, and redirects users with disallowed roles to `/unauthorized`. `ScrollToTop` scrolls to the top whenever the pathname changes.

### Role and authentication state

- `src/store/slices/authSlice.ts` defines `AuthUser`, the `SUPER_ADMIN | ADMIN | VIEWER` role union, and `setCredentials`/`logout`.
- `src/store/store.ts` currently registers only the `auth` reducer.
- Auth state is memory-only: it is not persisted across reloads and there is no authentication API integration.
- `src/components/dev/RoleSwitcher.tsx` selects a hard-coded test user for a role and dispatches `setCredentials`. It is currently rendered on the sign-in page, the test page, and inside `DashboardLayout`.
- The sign-in submit handler does not authenticate, and the visible Sign In button is `type="button"`; do not treat the form as functional login.
- `src/config/permissions.ts` defines permission strings and a role-to-permission map with `hasPermission`, but current route authorization uses role lists directly in `App.tsx`; the permission helper is not wired into routes or UI.
- `src/config/navigation.ts` supplies company and super-admin navigation data. Company navigation hides Team for `VIEWER`.

## Layouts and shared UI

- `src/components/layout/DashboardLayout.tsx` renders the company sidebar, development role switcher, and nested route outlet. The `/super` route currently uses this layout too, so its rendered sidebar is the company navigation.
- `src/components/layout/SuperAdminLayout.tsx` is present and uses `superAdminNavigation`, but it is not currently used by `App.tsx`.
- `src/components/layout/PageLayout.tsx` provides reusable page headings, descriptions, actions, and page-content spacing.
- `src/components/layout/Sidebar.tsx` renders the supplied navigation entries.
- `src/components/ui/` contains reusable `Card`, `DataChart`, generic `DataTable`, and `Pill` components.
- `src/components/auth/ProtectedRoute.tsx` implements the role gate. `src/pages/Unauthorized.tsx` and `src/components/layout/Notfound.tsx` are the corresponding access-denied and fallback screens.

## Feature and page map

- `src/pages/company/Overview.tsx` composes the revenue ledger, summary analytics, metric cards, and revenue-by-platform table.
- `src/features/revenue/components/` contains the revenue ledger visual, revenue-by-platform data table, and ledger chart.
- `src/features/analytics/components/` contains the analytics summary, metric grid, and order-value/new-customer trend charts.
- `src/pages/company/Analytics.tsx` uses the trend components; Campaign, Customers, Team, Transactions, and Upcoming are currently mostly placeholder content.
- `src/pages/superAdmin/Dashboard.tsx` is a placeholder dashboard. Although super-admin navigation entries for Companies, Members, and Settings are declared, those routes/pages are not currently registered.
- `src/test/Testing.tsx` makes an Axios GET request to a hard-coded external test URL on mount, stores/logs its response, and displays the selected test role. This is the only current HTTP request found in `src`.

## Data and integration status

- Overview metrics, revenue platform rows, ledger percentages, and chart series are static constants in their components/pages.
- There are no API service modules, Redux async thunks, RTK Query endpoints, query/mutation hooks, or browser storage persistence in the current source.
- `axios` is used only by the test page. Do not infer that dashboard data comes from that endpoint.
- The API Endpoint field on the sign-in page is UI-only and is not used to configure requests.
- Revenue displays use USD formatting in some components; other labels/design copy may use different currency wording. Follow the specific component's existing behavior unless asked to normalize it.

## Directory guide

```text
src/
  app/                 App route tree, typed Redux hooks, global styles
  components/
    auth/              Route authorization
    dev/               Development-only role switcher
    layout/            Dashboard, sidebar, and page layout components
    ui/                Reusable data display primitives
  config/              Role permissions and navigation definitions
  features/
    analytics/         Trend charts and analytics composition
    revenue/           Revenue visualizations and table
  pages/               Route-level page components
  store/               Redux store and auth slice
  test/                Test-only route/page
```

## Local commands

- `npm run dev` starts the Vite development server.
- `npm run build` runs the TypeScript project build and Vite production build.
- `npm run lint` runs Oxlint.
- `npm run preview` serves the built application locally.

## Guidance for changes

- Keep route registration in `src/app/App.tsx` and preserve its parent/child nesting semantics.
- When changing a role, update the `UserRole` definitions consistently in the auth slice and permission configuration, then check routes and navigation.
- Keep route access checks and navigation visibility conceptually separate: hiding a link is not route authorization.
- When replacing sample data with real data, add an explicit typed integration/data layer and loading/error handling rather than implying existing static values are API-backed.
- Treat `RoleSwitcher` and `/test` as development/test tooling; avoid making them production authentication or dashboard data sources.
- Prefer the existing `@/` source alias and shared layout/UI components when extending pages.
