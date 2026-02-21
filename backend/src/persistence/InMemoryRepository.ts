import { Item } from "../domain/Item";
import { ItemRepository } from "../domain/ItemRepository";

export class InMemoryRepository implements ItemRepository {
  private items: Item[] = [];

  async getItems() { return this.items; }
  async getItem(id: string) { return this.items.find(i => i.id === id); }
  async storeItem(item: Item) { this.items.push(item); }
  async updateItem(id: string, item: Item) {
    this.items = this.items.map(i => i.id === id ? item : i);
  }
  async removeItem(id: string) {
    this.items = this.items.filter(i => i.id !== id);
  }
}