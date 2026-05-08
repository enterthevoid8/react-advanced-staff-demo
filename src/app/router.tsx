import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";

const DashboardPage = lazy(() =>
  import("../features/dashboard/DashboardPage").then((module) => ({
    default: module.DashboardPage
  }))
);

const UsersPage = lazy(() =>
  import("../features/users/UsersPage").then((module) => ({
    default: module.UsersPage
  }))
);

const ProjectsPage = lazy(() =>
  import("../features/projects/ProjectsPage").then((module) => ({
    default: module.ProjectsPage
  }))
);

const ExperimentsPage = lazy(() =>
  import("../features/experiments/ExperimentsPage").then((module) => ({
    default: module.ExperimentsPage
  }))
);

const AdminPage = lazy(() =>
  import("../features/admin/AdminPage").then((module) => ({
    default: module.AdminPage
  }))
);

function RouteError() {
  return (
    <section className="card danger">
      <h1>Route error</h1>
      <p>The route failed to render.</p>
    </section>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "users",
        element: <UsersPage />
      },
      {
        path: "projects",
        element: <ProjectsPage />
      },
      {
        path: "experiments",
        element: <ExperimentsPage />
      },
      {
        path: "admin",
        element: <AdminPage />
      }
    ]
  }
]);