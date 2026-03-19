import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import type {
  Task,
  TaskRepository,
  ProjectView,
  ProjectStatus,
} from "../../domain/TaskRepository";

export class SqliteTaskRepository implements TaskRepository {
  private db!: sqlite3.Database;

  constructor(private readonly location: string = ":memory:") {}

  async init(): Promise<void> {
    if (this.location !== ":memory:") {
      const dir = path.dirname(this.location);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    await new Promise<void>((resolve, reject) => {
      this.db = new sqlite3.Database(this.location, (err) => {
        if (err) return reject(err);

        this.db.serialize(() => {
          this.db.run(
            `
            CREATE TABLE IF NOT EXISTS tasks (
              id TEXT PRIMARY KEY,
              user_id TEXT NOT NULL,
              project_id TEXT NOT NULL,
              name TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'OPEN'
            )
            `,
          );

          this.db.run(
            `
            CREATE TABLE IF NOT EXISTS project_status_view (
              project_id TEXT PRIMARY KEY,
              project_name TEXT NULL,
              status TEXT NOT NULL
            )
            `,
            (tableErr) => {
              if (tableErr) return reject(tableErr);
              resolve();
            },
          );
        });
      });
    });
  }

  async getTasks(userId: string): Promise<Task[]> {
    const rows = await new Promise<any[]>((resolve, reject) => {
      this.db.all(
        `
        SELECT id, name, status, project_id
        FROM tasks
        WHERE user_id = ?
        ORDER BY rowid ASC
        `,
        [userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      projectId: row.project_id,
    }));
  }

  async getTask(id: string, userId: string): Promise<Task | undefined> {
    const row = await new Promise<any>((resolve, reject) => {
      this.db.get(
        `
        SELECT id, name, status, project_id
        FROM tasks
        WHERE id = ? AND user_id = ?
        `,
        [id, userId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      status: row.status,
      projectId: row.project_id,
    };
  }

  async storeTask(task: Task, userId: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.run(
        `
        INSERT INTO tasks (id, user_id, project_id, name, status)
        VALUES (?, ?, ?, ?, ?)
        `,
        [task.id, userId, task.projectId, task.name, task.status],
        (err) => {
          if (err) return reject(err);
          resolve();
        },
      );
    });
  }

  async updateTask(id: string, task: Task, userId: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.run(
        `
        UPDATE tasks
        SET name = ?, status = ?, project_id = ?
        WHERE id = ? AND user_id = ?
        `,
        [task.name, task.status, task.projectId, id, userId],
        (err) => {
          if (err) return reject(err);
          resolve();
        },
      );
    });
  }

  async removeTask(id: string, userId: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.run(
        `
        DELETE FROM tasks
        WHERE id = ? AND user_id = ?
        `,
        [id, userId],
        (err) => {
          if (err) return reject(err);
          resolve();
        },
      );
    });
  }

  async getProjectView(projectId: string): Promise<ProjectView | undefined> {
    const row = await new Promise<any>((resolve, reject) => {
      this.db.get(
        `
        SELECT project_id, project_name, status
        FROM project_status_view
        WHERE project_id = ?
        `,
        [projectId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });

    if (!row) return undefined;

    return {
      projectId: row.project_id,
      projectName: row.project_name,
      status: row.status,
    };
  }

  async upsertProjectView(
    projectId: string,
    projectName: string | null,
    status: ProjectStatus,
  ): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.run(
        `
        INSERT INTO project_status_view (project_id, project_name, status)
        VALUES (?, ?, ?)
        ON CONFLICT(project_id) DO UPDATE SET
          project_name = excluded.project_name,
          status = excluded.status
        `,
        [projectId, projectName, status],
        (err) => {
          if (err) return reject(err);
          resolve();
        },
      );
    });
  }

  async teardown(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}