import { useMemo, useReducer, useTransition } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServices } from "../../services/createServices";
import {
  initialProjectWorkflowState,
  projectWorkflowReducer
} from "./projectReducer";
import { PermissionGate } from "../../auth/PermissionGate";
import type { Project } from "../../services/mockApi";
import { useUIStore } from "../../store/uiStore";

const statuses: Project["status"][] = ["planning", "active", "blocked", "done"];

export function ProjectsPage() {
  const { api } = useServices();
  const queryClient = useQueryClient();
  const pushToast = useUIStore((state) => state.pushToast);
  const [isPending, startTransition] = useTransition();

  const [workflow, dispatch] = useReducer(
    projectWorkflowReducer,
    initialProjectWorkflowState
  );

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: ({ signal }) => api.getProjects(signal)
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      projectId,
      status
    }: {
      projectId: string;
      status: Project["status"];
    }) => api.updateProjectStatus(projectId, status),

    onSuccess() {
      pushToast("Project status saved");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  });

  const selectedProject = useMemo(() => {
    return projectsQuery.data?.find(
      (project) => project.id === workflow.selectedProjectId
    );
  }, [projectsQuery.data, workflow.selectedProjectId]);

  if (projectsQuery.isLoading) {
    return <div className="card">Loading projects...</div>;
  }

  if (projectsQuery.isError) {
    return <div className="card danger">Failed to load projects.</div>;
  }

  return (
    <div className="stack">
      <section className="card">
        <h1>Projects</h1>
        <p>
          Demonstrates reducer-based workflow state, undo history, transitions,
          server mutations, and permission-gated writes.
        </p>
      </section>

      <section className="grid two">
        <div className="card">
          <h2>Project List</h2>

          {projectsQuery.data?.map((project) => (
            <button
              key={project.id}
              className="list-button"
              onClick={() => {
                startTransition(() => {
                  dispatch({
                    type: "select-project",
                    projectId: project.id,
                    status: project.status
                  });
                });
              }}
            >
              <strong>{project.name}</strong>
              <span>{project.status}</span>
            </button>
          ))}
        </div>

        <div className="card">
          <h2>Workflow Editor</h2>

          {isPending && <p>Preparing editor...</p>}

          {!selectedProject ? (
            <p>Select a project.</p>
          ) : (
            <>
              <h3>{selectedProject.name}</h3>
              <p>Owner: {selectedProject.owner}</p>

              <label>
                Draft status
                <select
                  value={workflow.draftStatus}
                  onChange={(event) =>
                    dispatch({
                      type: "change-status",
                      status: event.target.value as Project["status"]
                    })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <div className="actions">
                <button onClick={() => dispatch({ type: "undo" })}>Undo</button>

                <PermissionGate
                  permission="projects:write"
                  fallback={<span>No write permission</span>}
                >
                  <button
                    disabled={updateStatusMutation.isPending}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        projectId: selectedProject.id,
                        status: workflow.draftStatus
                      })
                    }
                  >
                    Save
                  </button>
                </PermissionGate>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}