import * as amqplib from "amqplib";
import type { ProjectRepository } from "../../domain/ProjectRepository";

export class RabbitConsumer {
  constructor(private readonly repo: ProjectRepository) {}

  async init(): Promise<void> {
    const url = process.env.RABBIT_URL || "amqp://rabbitmq:5672";
    const exchange = process.env.RABBIT_EXCHANGE || "domain-events";

    const conn = await amqplib.connect(url);
    const channel = await conn.createChannel();

    await channel.assertExchange(exchange, "topic", { durable: true });

    const q = await channel.assertQueue("", { exclusive: true });

    await channel.bindQueue(q.queue, exchange, "task.created");
    await channel.bindQueue(q.queue, exchange, "task.closed");
    await channel.bindQueue(q.queue, exchange, "task.reopened");
    await channel.bindQueue(q.queue, exchange, "task.deleted");

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;

      try {
        const routingKey = msg.fields.routingKey;
        const payload = JSON.parse(msg.content.toString());

        if (routingKey === "task.created") {
          await this.repo.incrementOpenTasks(payload.projectId);
        }

        if (routingKey === "task.closed") {
          await this.repo.closeTask(payload.projectId);
        }

        if (routingKey === "task.reopened") {
          await this.repo.reopenTask(payload.projectId);
        }

        if (routingKey === "task.deleted") {
            await this.repo.deleteTask(payload.projectId, payload.status === "CLOSED");
        }

        channel.ack(msg);
      } catch (e) {
        console.error("[projects] event handling failed", e);
        channel.nack(msg, false, false);
      }
    });
  }
}