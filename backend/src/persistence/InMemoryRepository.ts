import { Item } from "../domain/Item";
import { ItemRepository } from "../domain/ItemRepository";

export class InMemoryRepository implements ItemRepository {
  private items: Item[] = [];

  async getAll() { return this.items; }
  async getById(id: string) { return this.items.find(i => i.id === id); }
  async add(item: Item) { this.items.push(item); }
  async update(id: string, item: Item) {
    this.items = this.items.map(i => i.id === id ? item : i);
  }
  async delete(id: string) {
    this.items = this.items.filter(i => i.id !== id);
  }
}