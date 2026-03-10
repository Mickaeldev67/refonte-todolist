import amqp from "amqplib";
import { v4 as uuid } from "uuid";
import type { NotificationRepository } from "../../domain/NotificationRepository";

export class RabbitConsumer {
  constructor(private repo: NotificationRepository) {}

  async init(): Promise<void> {
    const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
    const exchange = "domain-events";

    const maxAttempts = 30;
    const delayMs = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const conn = await amqp.connect(url);
        const channel = await conn.createChannel();

        await channel.assertExchange(exchange, "topic", { durable: true });

        const q = await channel.assertQueue("", { exclusive: true });

        await channel.bindQueue(q.queue, exchange, "task.reopened");
        await channel.bindQueue(q.queue, exchange, "project.closed");

        channel.consume(q.queue, async (msg) => {
          if (!msg) return;

          try {
            const routingKey = msg.fields.routingKey;
            const payload = JSON.parse(msg.content.toString());

            if (routingKey === "task.reopened") {
              const notification = {
                id: uuid(),
                userId: payload.userId,
                projectId: payload.projectId,
                projectName: payload.projectName,
                type: "TASK_REOPENED" as const,
                message: `Tâche réouverte dans le projet ${payload.projectName} par l'utilisateur ${payload.userId}`,
              };

              await this.repo.storeNotification(notification);
              console.log(`[notification] ${notification.message}`);
            }

            if (routingKey === "project.closed") {
              const notification = {
                id: uuid(),
                userId: payload.userId,
                type: "PROJECT_CLOSED" as const,
                message: `Project ${payload.projectName} clos par l'utilisateur ${payload.userId}`,
              };

              await this.repo.storeNotification(notification);
              console.log(`[notification] ${notification.message}`);
            }

            channel.ack(msg);
          } catch (e) {
            console.error("[notifications] failed to process message", e);
            channel.nack(msg, false, false);
          }
        });

        console.log("[notifications] listening for events");
        return;
      } catch (e) {
        console.log(`[notifications] rabbitmq not ready (attempt ${attempt}/${maxAttempts})`);
        if (attempt === maxAttempts) throw e;
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
}