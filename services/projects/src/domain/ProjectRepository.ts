import type { Project } from "./Project";

export interface ProjectRepository {
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string, userId: string): Promise<Project | undefined>;
  storeProject(project: Project): Promise<void>;
  updateProject(id: string, project: Project, userId: string): Promise<void>;
  removeProject(id: string, userId: string): Promise<void>;

  incrementOpenTasks(projectId: string): Promise<void>;
  closeTask(projectId: string): Promise<void>;
  reopenTask(projectId: string): Promise<void>;
  deleteTask(projectId: string, wasCompleted: boolean): Promise<void>;

  teardown(): Promise<void>;
}