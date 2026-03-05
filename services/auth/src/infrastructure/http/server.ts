import express from "express";
import type { AuthRepository } from "../../domain/AuthRepository";
import { buildAuthRoutes } from "./routes";

export function startAuthServer(repo: AuthRepository, port: number) {
  const app = express();
  app.use(express.json());
  app.use(buildAuthRoutes(repo));

  app.listen(port, () => console.log(`[auth] listening on ${port}`));
}