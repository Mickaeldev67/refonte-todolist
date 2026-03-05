import mysql from "mysql2";
import type { Pool } from "mysql2";
import type { TaskRepository, Task } from "../../domain/TaskRepository";

export class MysqlTaskRepository implements TaskRepository {
  private pool!: Pool;

  async init(): Promise<void> {
    this.pool = mysql.createPool({
      connectionLimit: 5,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB || "task_db",
      charset: "utf8mb4",
    });
  }

  async getTasks(userId: string): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        "SELECT id, name, completed, project_id FROM tasks WHERE user_id=?",
        [userId],
        (err, rows: any[]) => {
          if (err) return reject(err);
          resolve(rows.map((r) => ({ id: r.id, name: r.name, completed: r.completed === 1, projectId: r.project_id })));
        }
      );
    });
  }

  async getTask(id: string, userId: string): Promise<Task | undefined> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        "SELECT id, name, completed, project_id FROM tasks WHERE id=? AND user_id=?",
        [id, userId],
        (err, rows: any[]) => {
          if (err) return reject(err);
          const r = rows[0];
          if (!r) return resolve(undefined);
          resolve({ id: r.id, name: r.name, completed: r.completed === 1, projectId: r.project_id });
        }
      );
    });
  }

  async storeTask(task: Task, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        "INSERT INTO tasks (id, user_id, project_id, name, completed) VALUES (?, ?, ?, ?, ?)",
        [task.id, userId, task.projectId, task.name, task.completed ? 1 : 0],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async updateTask(id: string, task: Task, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        "UPDATE tasks SET name=?, completed=?, project_id=? WHERE id=? AND user_id=?",
        [task.name, task.completed ? 1 : 0, task.projectId, id, userId],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async removeTask(id: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query("DELETE FROM tasks WHERE id=? AND user_id=?", [id, userId], (err) => (err ? reject(err) : resolve()));
    });
  }

  async teardown(): Promise<void> {
    return new Promise((resolve, reject) => this.pool.end((err) => (err ? reject(err) : resolve())));
  }
}