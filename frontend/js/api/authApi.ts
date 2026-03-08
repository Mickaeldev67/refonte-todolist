import { apiFetch } from "./client";

export async function getMe() {
  return apiFetch("/auth/me", { method: "GET" });
}

export async function login(username: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function register(username: string, password: string) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}