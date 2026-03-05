export type Task = { id: string; name: string; completed: boolean; projectId: string };

export interface TaskRepository {
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string, userId: string): Promise<Task | undefined>;
  storeTask(task: Task, userId: string): Promise<void>;
  updateTask(id: string, task: Task, userId: string): Promise<void>;
  removeTask(id: string, userId: string): Promise<void>;
  teardown(): Promise<void>;
}