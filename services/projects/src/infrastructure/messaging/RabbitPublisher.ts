import * as amqplib from "amqplib";

type AmqpConnection = Awaited<ReturnType<typeof amqplib.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection["createChannel"]>>;

export class RabbitPublisher {
  private conn!: AmqpConnection;
  private channel!: AmqpChannel;
  private exchange = process.env.RABBIT_EXCHANGE || "domain-events";

  async init(): Promise<void> {
    const url = process.env.RABBIT_URL || "amqp://rabbitmq:5672";
    const maxAttempts = 30;
    const delayMs = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        this.conn = await amqplib.connect(url);
        this.channel = await this.conn.createChannel();
        await this.channel.assertExchange(this.exchange, "topic", { durable: true });
        console.log(`[projects] rabbitmq connected (attempt ${attempt})`);
        return;
      } catch (e) {
        console.log(`[projects] rabbitmq not ready (attempt ${attempt}/${maxAttempts})`);
        if (attempt === maxAttempts) throw e;
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  async publish(routingKey: string, payload: unknown): Promise<void> {
    const body = Buffer.from(JSON.stringify(payload));
    this.channel.publish(this.exchange, routingKey, body, { contentType: "application/json" });
  }
}