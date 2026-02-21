import { Item } from './Item';

export interface ItemRepository {
  getAll(): Promise<Item[]>;
  getById(id: string): Promise<Item | undefined>;
  add(item: Item): Promise<void>;
  update(id: string, item: Item): Promise<void>;
  delete(id: string): Promise<void>;
}