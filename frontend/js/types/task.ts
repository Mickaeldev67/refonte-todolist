export type TaskStatus = "OPEN" | "CLOSED";

export type Task = {
  id: string;
  name: string;
  status: TaskStatus;
  projectId: string;
};