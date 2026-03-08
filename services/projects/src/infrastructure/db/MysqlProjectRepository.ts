import mysql from "mysql2";
import type { Pool } from "mysql2";
import type { ProjectRepository } from "../../domain/ProjectRepository";
import type { Project } from "../../domain/Project";

export class MysqlProjectRepository implements ProjectRepository {
  private pool!: Pool;

  async init(): Promise<void> {
    this.pool = mysql.createPool({
      connectionLimit: 5,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB || "project_db",
      charset: "utf8mb4",
    });
  }

  async getProjects(userId: string): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        `SELECT id, user_id, name, description, status, created_at, closed_at, open_tasks_count, closed_tasks_count
         FROM projects
         WHERE user_id=?`,
        [userId],
        (err, rows: any[]) => {
          if (err) return reject(err);
          resolve(rows.map((r) => ({
            id: r.id,
            userId: r.user_id,
            name: r.name,
            description: r.description,
            status: r.status,
            createdAt: r.created_at,
            closedAt: r.closed_at,
            openTasksCount: r.open_tasks_count,
            closedTasksCount: r.closed_tasks_count,
          })));
        }
      );
    });
  }

  async getProject(id: string, userId: string): Promise<Project | undefined> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        `SELECT id, user_id, name, description, status, created_at, closed_at, open_tasks_count, closed_tasks_count
         FROM projects
         WHERE id=? AND user_id=?`,
        [id, userId],
        (err, rows: any[]) => {
          if (err) return reject(err);
          const r = rows[0];
          if (!r) return resolve(undefined);

          resolve({
            id: r.id,
            userId: r.user_id,
            name: r.name,
            description: r.description,
            status: r.status,
            createdAt: r.created_at,
            closedAt: r.closed_at,
            openTasksCount: r.open_tasks_count,
            closedTasksCount: r.closed_tasks_count,
          });
        }
      );
    });
  }

  async storeProject(project: Project): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        `INSERT INTO projects
         (id, user_id, name, description, status, closed_at, open_tasks_count, closed_tasks_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project.id,
          project.userId,
          project.name,
          project.description ?? null,
          project.status,
          project.closedAt ?? null,
          project.openTasksCount,
          project.closedTasksCount,
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async updateProject(id: string, project: Project, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        `UPDATE projects
         SET name=?, description=?, status=?, closed_at=?
         WHERE id=? AND user_id=?`,
        [
          project.name,
          project.description ?? null,
          project.status,
          project.closedAt ?? null,
          id,
          userId,
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async removeProject(id: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        `DELETE FROM projects WHERE id=? AND user_id=?`,
        [id, userId],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async incrementOpenTasks(projectId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        `UPDATE projects SET open_tasks_count = open_tasks_count + 1 WHERE id=?`,
        [projectId],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async closeTask(projectId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        `UPDATE projects
         SET open_tasks_count = GREATEST(open_tasks_count - 1, 0),
             closed_tasks_count = closed_tasks_count + 1
         WHERE id=?`,
        [projectId],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async reopenTask(projectId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        `UPDATE projects
         SET open_tasks_count = open_tasks_count + 1,
             closed_tasks_count = GREATEST(closed_tasks_count - 1, 0)
         WHERE id=?`,
        [projectId],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async deleteTask(projectId: string, wasCompleted: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = wasCompleted
        ? `UPDATE projects SET closed_tasks_count = GREATEST(closed_tasks_count - 1, 0) WHERE id=?`
        : `UPDATE projects SET open_tasks_count = GREATEST(open_tasks_count - 1, 0) WHERE id=?`;

      this.pool.query(query, [projectId], (err) => (err ? reject(err) : resolve()));
    });
  }

  async teardown(): Promise<void> {
    return new Promise((resolve, reject) => this.pool.end((err) => (err ? reject(err) : resolve())));
  }
}