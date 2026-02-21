import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { ItemRepository } from '../domain/ItemRepository';
import { Item } from '../domain/Item';

export class SqliteRepository implements ItemRepository {
  private db!: sqlite3.Database;
  private location = process.env.SQLITE_DB_LOCATION || './todo.db';

  async init(): Promise<void> {
    const dirName = path.dirname(this.location);
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.location, (err) => {
        if (err) return reject(err);

        this.db.run(
          'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
          (err) => (err ? reject(err) : resolve())
        );
      });
    });
  }

  async getItems(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM todo_items', (err, rows: any[]) => {
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
      this.db.get(
        'SELECT * FROM todo_items WHERE id=?',
        [id],
        (err, row: any) => {
          if (err) return reject(err);
          if (!row) return resolve(undefined);

          resolve({
            id: row.id,
            name: row.name,
            completed: row.completed === 1,
          });
        }
      );
    });
  }

  async storeItem(item: Item): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
        [item.id, item.name, item.completed ? 1 : 0],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async updateItem(id: string, item: Item): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE todo_items SET name=?, completed=? WHERE id=?',
        [item.name, item.completed ? 1 : 0, id],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async removeItem(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM todo_items WHERE id=?',
        [id],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async teardown(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close(err => (err ? reject(err) : resolve()));
    });
  }
}