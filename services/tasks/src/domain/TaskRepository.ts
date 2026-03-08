export type TaskStatus = "OPEN" | "CLOSED";
export type ProjectStatus = "OPEN" | "CLOSED";

export type Task = {
  id: string;
  name: string;
  status: TaskStatus;
  projectId: string;
};

export interface TaskRepository {
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string, userId: string): Promise<Task | undefined>;
  storeTask(task: Task, userId: string): Promise<void>;
  updateTask(id: string, task: Task, userId: string): Promise<void>;
  removeTask(id: string, userId: string): Promise<void>;

  getProjectStatus(projectId: string): Promise<ProjectStatus | undefined>;
  upsertProjectStatus(projectId: string, status: ProjectStatus): Promise<void>;

  teardown(): Promise<void>;
}