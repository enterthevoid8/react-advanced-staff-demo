# Advanced React Staff Demo

A runnable React + TypeScript project demonstrating advanced React architecture patterns commonly expected from senior, tech lead, or staff-level frontend engineers.

This project is intentionally small enough to understand quickly, but it includes production-style patterns such as dependency injection, feature flags, permissions, server-state caching, reducers, optimistic updates, route-level code splitting, portals, compound components, and virtualization.

---

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack React Query
- Zustand
- Zod

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open the app

```
http://localhost:5173
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the local Vite development server |
| `npm run build` | Runs TypeScript checks and creates a production build |
| `npm run preview` | Serves the production build locally |

---

## Routes

| Path | Description |
|---|---|
| `/` | Dashboard |
| `/users` | Users demo |
| `/projects` | Project workflow demo |
| `/experiments` | Feature flag demo |
| `/admin` | Permission-gated admin console |

Open the command palette with `Ctrl+K` (or `Cmd+K` on macOS).

---

## What This Project Demonstrates

### 1. Feature-First Architecture

The app is organized by business capability instead of technical layer.

```
src/
  features/
    users/
    projects/
    dashboard/
    admin/
    experiments/
```

This keeps related UI, state, and logic close together and makes the project easier to scale by product area.

### 2. Dependency Injection Through Services

The app creates a service boundary in `src/services/createServices.ts`. Components never import API implementations directly — they access services through a provider:

```ts
const { api, telemetry } = useServices();
```

This makes the app easier to test, mock, replace, and scale.

### 3. Server State With React Query

Remote data is owned by TanStack React Query:

```ts
const usersQuery = useQuery({
  queryKey: ["users"],
  queryFn: ({ signal }) => api.getUsers(signal)
});
```

React Query handles caching, loading states, error states, retries, stale data, request cancellation, invalidation, and optimistic updates.

### 4. Client State Separation

The app separates client state by responsibility:

| Layer | Responsibility |
|---|---|
| React Query | Server / cache state |
| Zustand | Global UI state (toasts, sidebar, command palette) |
| `useReducer` | Complex local workflow state |
| Context | Auth, permissions, feature flags, services |

This avoids putting everything into one global store.

### 5. Optimistic Updates

The Users page updates the UI before the server mutation completes:

```ts
onMutate() {
  // snapshot previous cache, update immediately
},
onError() {
  // rollback if the mutation fails
},
onSettled() {
  // revalidate server state
}
```

### 6. Permission Gates

Permissions are typed in `src/auth/permissions.ts` and UI access is controlled through:

```tsx
<PermissionGate permission="users:write">
  <button>Toggle active</button>
</PermissionGate>
```

Supported roles: `admin`, `manager`, `engineer`. Switch roles from the top-right role selector.

### 7. Feature Flags

Feature flags live in `src/flags/FeatureFlagProvider.tsx`:

```ts
const { isEnabled } = useFeatureFlags();

if (isEnabled("virtualized-users")) {
  // render virtualized version
}
```

In a real application this layer can be backed by LaunchDarkly, Statsig, Unleash, or an internal experimentation platform.

### 8. Reducer-Based Workflow State

The Projects page uses a reducer at `src/features/projects/projectReducer.ts`, demonstrating explicit state transitions, undo history, selected project state, draft status editing, and reset behavior.

Reducers are useful when component state becomes event-driven or multi-step.

### 9. Route-Level Code Splitting

Routes are lazy-loaded in `src/app/router.tsx`:

```ts
const UsersPage = lazy(() =>
  import("../features/users/UsersPage").then((module) => ({
    default: module.UsersPage
  }))
);
```

This keeps the initial JavaScript bundle smaller.

### 10. Suspense and Error Boundaries

The app uses `src/components/ErrorBoundary.tsx` and wraps lazy routes with:

```tsx
<Suspense fallback={<div className="card">Loading route...</div>}>
  <Outlet />
</Suspense>
```

This separates loading and error handling concerns from feature components.

### 11. Accessible Compound Components

Tabs are implemented as a compound component:

```tsx
<Tabs.Root defaultValue="architecture">
  <Tabs.List>
    <Tabs.Trigger value="architecture">Architecture</Tabs.Trigger>
    <Tabs.Trigger value="runtime">Runtime</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Panel value="architecture">
    Content
  </Tabs.Panel>
</Tabs.Root>
```

This pattern gives a clean public API while hiding internal coordination through context.

### 12. Portal-Based Modal

The modal renders into `<div id="modal-root"></div>` via `createPortal`, and also demonstrates escape-key dismissal, backdrop click dismissal, focus restoration, and dialog semantics.

### 13. Command Palette

Open with `Ctrl+K` / `Cmd+K`. Uses Zustand for open/close state, React Router for navigation, a modal portal, and feature flag control.

### 14. Virtualized List

`src/components/VirtualList.tsx` renders only the visible rows instead of every item in the array — useful for large lists, logs, tables, event streams, and admin screens.

### 15. Runtime Validation With Zod

Mock API responses are validated with Zod:

```ts
return z.array(UserSchema).parse(users);
```

This protects the UI from invalid data shapes and makes API contracts explicit.

---

## Folder Overview

```
src/
  app/
    App.tsx
    providers.tsx
    queryClient.ts
    router.tsx

  auth/
    AuthProvider.tsx
    PermissionGate.tsx
    permissions.ts

  components/
    CommandPalette.tsx
    ErrorBoundary.tsx
    Modal.tsx
    Tabs.tsx
    VirtualList.tsx

  features/
    admin/
    dashboard/
    experiments/
    projects/
    users/

  flags/
    FeatureFlagProvider.tsx

  hooks/
    useDebouncedValue.ts
    useMediaQuery.ts
    usePrevious.ts
    useStableEvent.ts

  services/
    createServices.ts
    mockApi.ts
    telemetry.ts

  store/
    uiStore.ts

  main.tsx
  styles.css
```

---

## Architecture Principles

**Keep server state out of global client stores.**
Server data should be managed by React Query, SWR, Relay, Apollo, or another server-state library. Avoid copying server data into Zustand, Redux, or Context unless there is a specific reason.

**Keep dependency boundaries explicit.**
Components should not know whether data comes from REST, GraphQL, local mocks, IndexedDB, a native bridge, or a third-party SDK. The service layer hides those details.

**Prefer local state first.**
Escalate state only when needed:

```
useState → useReducer → Context → external store → server-state cache
```

**Model permissions as data.**
Instead of scattering role checks through the UI (`user.role === "admin"`), centralize authorization with typed permissions (`hasPermission("projects:write")`). Easier to audit, safer to change.

**Isolate product experiments.**
Feature flags should not leak deeply throughout the app. Use a small provider API (`isEnabled("new-project-workflow")`) so flags are easy to remove later.

---

## Suggested Interview Talking Points

- Why server state and client state should be separated
- When Context is appropriate and when it is not
- Why feature-first architecture scales better than flat technical folders
- How optimistic updates work and when to use them
- How to design permission systems
- How to introduce feature flags safely
- When reducers are better than multiple `useState` calls
- How Suspense and lazy routes affect bundle size
- Why dependency injection improves testability
- How to handle observability from the frontend
- Trade-offs between Zustand, Redux, Context, and React Query

---

## Possible Next Improvements

- Add Vitest and React Testing Library
- Add MSW for API-level tests
- Add Playwright for end-to-end tests
- Add Storybook for reusable component documentation
- Add ESLint and Prettier
- Add React Hook Form for complex forms
- Add URL-driven filters and pagination
- Add authentication persistence
- Add audit logging
- Add accessibility tests
- Add bundle analysis
- Add CI workflow

---

## Production Notes

This is a demo project — the API is mocked in memory. For production, replace `src/services/mockApi.ts` with a real API client. The service interface can remain stable while the implementation changes:

```
services/
  apiClient.ts
  userService.ts
  projectService.ts
  telemetry.ts
  createServices.ts
```

---

## License

MIT