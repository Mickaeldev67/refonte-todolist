import fs from 'fs';
import mysql from 'mysql2';
import type { Pool } from 'mysql2';
import { ItemRepository } from '../domain/ItemRepository';
import { Item } from '../domain/Item';

export class MysqlRepository implements ItemRepository {
  private pool!: Pool;

  private host = process.env.MYSQL_HOST || '';
  private user = process.env.MYSQL_USER || '';
  private password = process.env.MYSQL_PASSWORD || '';
  private database = process.env.MYSQL_DB || '';

  async init(): Promise<void> {
    // Lecture depuis fichiers si nécessaire
    if (process.env.MYSQL_HOST_FILE) this.host = fs.readFileSync(process.env.MYSQL_HOST_FILE).toString();
    if (process.env.MYSQL_USER_FILE) this.user = fs.readFileSync(process.env.MYSQL_USER_FILE).toString();
    if (process.env.MYSQL_PASSWORD_FILE) this.password = fs.readFileSync(process.env.MYSQL_PASSWORD_FILE).toString();
    if (process.env.MYSQL_DB_FILE) this.database = fs.readFileSync(process.env.MYSQL_DB_FILE).toString();

    this.pool = mysql.createPool({
      connectionLimit: 5,
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
      charset: 'utf8mb4',
    });

    // Création de la table si elle n'existe pas
    await new Promise<void>((resolve, reject) => {
      this.pool.query(
        'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean) DEFAULT CHARSET utf8mb4',
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async getItems(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      this.pool.query('SELECT * FROM todo_items', (err, rows: any[]) => {
        if (err) return reject(err);
        resolve(
          rows.map(row => ({
            id: row.id,
            name: row.name,
            completed: row.completed === 1,
          }))
        );
      });
    });
  }

  async getItem(id: string): Promise<Item | undefined> {
    return new Promise((resolve, reject) => {
      this.pool.query('SELECT * FROM todo_items WHERE id=?', [id], (err, rows: any[]) => {
        if (err) return reject(err);
        const row = rows[0];
        if (!row) return resolve(undefined);
        resolve({
          id: row.id,
          name: row.name,
          completed: row.completed === 1,
        });
      });
    });
  }

  async storeItem(item: Item): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
        [item.id, item.name, item.completed ? 1 : 0],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async updateItem(id: string, item: Item): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query(
        'UPDATE todo_items SET name=?, completed=? WHERE id=?',
        [item.name, item.completed ? 1 : 0, id],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async removeItem(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.query('DELETE FROM todo_items WHERE id=?', [id], (err) => (err ? reject(err) : resolve()));
    });
  }

  async teardown(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.end(err => (err ? reject(err) : resolve()));
    });
  }
}