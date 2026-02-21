import { Item } from './Item';

export interface ItemRepository {
  getItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  storeItem(item: Item): Promise<void>;
  updateItem(id: string, item: Item): Promise<void>;
  removeItem(id: string): Promise<void>;
  teardown?(): Promise<void>;
}