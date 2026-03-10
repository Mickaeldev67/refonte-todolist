import { MysqlNotificationRepository } from "./infrastructure/db/MysqlNotificationRepository";
import { RabbitConsumer } from "./infrastructure/messaging/RabbitConsumer";

async function start() {

  const repo = new MysqlNotificationRepository();
  await repo.init();

  const consumer = new RabbitConsumer(repo);
  await consumer.init();

  console.log("[notifications] listening for events");

}

start();