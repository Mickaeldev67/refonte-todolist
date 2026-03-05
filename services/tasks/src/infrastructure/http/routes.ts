import express from "express";
import { v4 as uuid } from "uuid";
import type { TaskRepository } from "../../domain/TaskRepository";
import type { RabbitPublisher } from "../messaging/RabbitPublisher";

export function buildTaskRoutes(repo: TaskRepository, bus: RabbitPublisher) {
  const r = express.Router();
  const getUserId = (req: express.Request) => req.header("X-User-Id") || "";

  r.get("/tasks", async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    res.json(await repo.getTasks(userId));
  });

  r.post("/tasks", async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { name, projectId } = req.body ?? {};
    if (!name || !projectId) return res.status(400).json({ error: "Missing fields" });

    const task = { id: uuid(), name: String(name), completed: false, projectId: String(projectId) };
    await repo.storeTask(task, userId);

    await bus.publish("task.created", { taskId: task.id, projectId: task.projectId, userId });
    res.json(task);
  });

  r.post("/tasks/:id/close", async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const t = await repo.getTask(req.params.id, userId);
    if (!t) return res.status(404).json({ error: "Not found" });

    t.completed = true;
    await repo.updateTask(t.id, t, userId);

    await bus.publish("task.closed", { taskId: t.id, projectId: t.projectId, userId });
    res.json(t);
  });

  r.delete("/tasks/:id", async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const t = await repo.getTask(req.params.id, userId);
    if (!t) return res.status(404).json({ error: "Not found" });

    await repo.removeTask(t.id, userId);
    await bus.publish("task.deleted", { taskId: t.id, projectId: t.projectId, userId });

    res.json({ ok: true });
  });

  return r;
}