export type ProjectStatus = "OPEN" | "CLOSED";

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  openTasksCount: number;
  closedTasksCount: number;
};