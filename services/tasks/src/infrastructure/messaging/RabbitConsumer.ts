import * as amqplib from "amqplib";
import type { TaskRepository } from "../../domain/TaskRepository";

export class RabbitConsumer {
  constructor(private readonly repo: TaskRepository) {}

  async init(): Promise<void> {
    const url = process.env.RABBIT_URL || "amqp://rabbitmq:5672";
    const exchange = process.env.RABBIT_EXCHANGE || "domain-events";

    const maxAttempts = 30;
    const delayMs = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const conn = await amqplib.connect(url);
        const channel = await conn.createChannel();

        await channel.assertExchange(exchange, "topic", { durable: true });

        const q = await channel.assertQueue("", { exclusive: true });

        await channel.bindQueue(q.queue, exchange, "project.created");
        await channel.bindQueue(q.queue, exchange, "project.closed");

        await channel.consume(q.queue, async (msg) => {
          if (!msg) return;

          try {
            const routingKey = msg.fields.routingKey;
            const payload = JSON.parse(msg.content.toString());

            if (routingKey === "project.created") {
              await this.repo.upsertProjectStatus(payload.projectId, "OPEN");
            }

            if (routingKey === "project.closed") {
              await this.repo.upsertProjectStatus(payload.projectId, "CLOSED");
            }

            channel.ack(msg);
          } catch (e) {
            console.error("[tasks] project event handling failed", e);
            channel.nack(msg, false, false);
          }
        });

        console.log("[tasks] rabbit consumer started");
        return;
      } catch (e) {
        console.log(`[tasks] rabbit consumer not ready (attempt ${attempt}/${maxAttempts})`);
        if (attempt === maxAttempts) throw e;
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
}