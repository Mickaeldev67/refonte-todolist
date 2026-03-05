export interface AuthRepository {
  getUserByUsername(username: string): Promise<{ id: string; username: string; passwordHash: string } | undefined>;
  getUserById(id: string): Promise<{ id: string; username: string } | undefined>;
  createUser(user: { id: string; username: string; passwordHash: string }): Promise<void>;
  teardown(): Promise<void>;
}