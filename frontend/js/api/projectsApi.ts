import { apiFetch } from "./client";

export async function getProjects() {
  return apiFetch("/projects", { method: "GET" });
}

export async function createProject(name: string, description?: string) {
  return apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function closeProject(projectId: string) {
  return apiFetch(`/projects/${projectId}/close`, {
    method: "POST",
  });
}

export async function deleteProject(projectId: string) {
  return apiFetch(`/projects/${projectId}`, {
    method: "DELETE",
  });
}