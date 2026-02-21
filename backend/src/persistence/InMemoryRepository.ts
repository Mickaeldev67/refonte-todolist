import { Item } from '../../src/domain/Item';
import { ItemRepository } from '../../src/domain/ItemRepository';

export class InMemoryRepository implements ItemRepository {
  private items: Item[] = [];

  async init(): Promise<void> {
    this.items = [];
  }

  async teardown(): Promise<void> {
    this.items = [];
  }

  async getItems(): Promise<Item[]> {
    return [...this.items];
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.find(i => i.id === id);
  }

  async storeItem(item: Item): Promise<void> {
    this.items.push(item);
  }

  async updateItem(id: string, item: Item): Promise<void> {
    const index = this.items.findIndex(i => i.id === id);
    if (index !== -1) {
      this.items[index] = item;
    }
  }

  async removeItem(id: string): Promise<void> {
    this.items = this.items.filter(i => i.id !== id);
  }
}