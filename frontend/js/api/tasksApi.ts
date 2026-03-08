import { apiFetch } from "./client";

export async function getTasks() {
  return apiFetch("/tasks", { method: "GET" });
}

export async function createTask(name: string, projectId: string) {
  return apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify({ name, projectId }),
  });
}

export async function closeTask(taskId: string) {
  return apiFetch(`/tasks/${taskId}/close`, {
    method: "POST",
  });
}

export async function reopenTask(taskId: string) {
  return apiFetch(`/tasks/${taskId}/reopen`, {
    method: "POST",
  });
}

export async function deleteTask(taskId: string) {
  return apiFetch(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}