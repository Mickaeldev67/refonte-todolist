import type { Notification } from "./Notification";

export interface NotificationRepository {
  storeNotification(notification: Notification): Promise<void>;
  teardown(): Promise<void>;
}