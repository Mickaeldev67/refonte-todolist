import express from "express";
import session from "express-session";
import cors from "cors";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const AUTH_URL = process.env.AUTH_URL || "http://auth:3001";
const TASKS_URL = process.env.TASKS_URL || "http://tasks:3002";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });
  next();
}

app.post("/auth/register", async (req, res) => {
  const r = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });
  const data = await r.json();
  if (!r.ok) return res.status(r.status).json(data);
  req.session.userId = data.userId;
  res.json({ ok: true, userId: data.userId });
});

app.post("/auth/login", async (req, res) => {
  const r = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });
  const data = await r.json();
  if (!r.ok) return res.status(r.status).json(data);
  req.session.userId = data.userId;
  res.json({ ok: true, userId: data.userId });
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/auth/me", requireAuth, async (req, res) => {
  const r = await fetch(`${AUTH_URL}/me`, { headers: { "X-User-Id": req.session.userId! } });
  res.status(r.status).json(await r.json());
});

app.get("/tasks", requireAuth, async (req, res) => {
  const r = await fetch(`${TASKS_URL}/tasks`, { headers: { "X-User-Id": req.session.userId! } });
  res.status(r.status).json(await r.json());
});

app.post("/tasks", requireAuth, async (req, res) => {
  const r = await fetch(`${TASKS_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-User-Id": req.session.userId! },
    body: JSON.stringify(req.body),
  });
  res.status(r.status).json(await r.json());
});

app.post("/tasks/:id/close", requireAuth, async (req, res) => {
  const r = await fetch(`${TASKS_URL}/tasks/${req.params.id}/close`, {
    method: "POST",
    headers: { "X-User-Id": req.session.userId! },
  });
  res.status(r.status).json(await r.json());
});

app.delete("/tasks/:id", requireAuth, async (req, res) => {
  const r = await fetch(`${TASKS_URL}/tasks/${req.params.id}`, {
    method: "DELETE",
    headers: { "X-User-Id": req.session.userId! },
  });
  res.status(r.status).json(await r.json());
});

app.listen(3000, () => console.log("[gateway] listening on 3000"));