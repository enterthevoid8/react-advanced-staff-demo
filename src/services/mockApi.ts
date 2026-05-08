import { z } from "zod";

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const id = window.setTimeout(resolve, ms);

    signal?.addEventListener("abort", () => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["admin", "manager", "engineer"]),
  active: z.boolean()
});

export type User = z.infer<typeof UserSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["planning", "active", "blocked", "done"]),
  owner: z.string()
});

export type Project = z.infer<typeof ProjectSchema>;

let users: User[] = [
  { id: "u1", name: "Asha Rao", role: "admin", active: true },
  { id: "u2", name: "Daniel Kim", role: "manager", active: true },
  { id: "u3", name: "Fatima Ali", role: "engineer", active: false },
  { id: "u4", name: "Miguel Santos", role: "engineer", active: true }
];

let projects: Project[] = [
  { id: "p1", name: "Design System Platform", status: "active", owner: "Asha Rao" },
  { id: "p2", name: "Billing Migration", status: "blocked", owner: "Daniel Kim" },
  { id: "p3", name: "Search Relevance", status: "planning", owner: "Fatima Ali" }
];

export function createMockApi() {
  return {
    async getUsers(signal?: AbortSignal) {
      await sleep(600, signal);
      return z.array(UserSchema).parse(users);
    },

    async toggleUserActive(userId: string) {
      await sleep(300);

      users = users.map((user) =>
        user.id === userId ? { ...user, active: !user.active } : user
      );

      return UserSchema.parse(users.find((user) => user.id === userId));
    },

    async getProjects(signal?: AbortSignal) {
      await sleep(500, signal);
      return z.array(ProjectSchema).parse(projects);
    },

    async updateProjectStatus(projectId: string, status: Project["status"]) {
      await sleep(300);

      projects = projects.map((project) =>
        project.id === projectId ? { ...project, status } : project
      );

      return ProjectSchema.parse(projects.find((project) => project.id === projectId));
    }
  };
}

export type MockApi = ReturnType<typeof createMockApi>;