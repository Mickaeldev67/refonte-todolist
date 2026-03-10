import mysql from "mysql2";
import type { Pool } from "mysql2";
import type { NotificationRepository } from "../../domain/NotificationRepository";
import type { Notification } from "../../domain/Notification";

export class MysqlNotificationRepository implements NotificationRepository {

  private pool!: Pool;

  async init(): Promise<void> {
    this.pool = mysql.createPool({
      connectionLimit: 5,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB || "notification_db",
      charset: "utf8mb4"
    });
  }

  async storeNotification(notification: Notification): Promise<void> {
    return new Promise((resolve, reject) => {

      this.pool.query(
        `INSERT INTO notifications
        (id, user_id, project_id, message, type)
        VALUES (?, ?, ?, ?, ?)`,
        [
          notification.id,
          notification.userId,
          notification.projectId || null,
          notification.message,
          notification.type
        ],
        err => err ? reject(err) : resolve()
      );

    });
  }

  async teardown(): Promise<void> {
    return new Promise((resolve, reject) =>
      this.pool.end(err => err ? reject(err) : resolve())
    );
  }

}