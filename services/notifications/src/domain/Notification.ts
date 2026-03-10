export type NotificationType =
  | "TASK_REOPENED"
  | "PROJECT_CLOSED";

export type Notification = {
  id: string;
  userId: string;
  projectId?: string | null;
  message: string;
  type: NotificationType;
};