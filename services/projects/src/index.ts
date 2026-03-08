import { MysqlProjectRepository } from "./infrastructure/db/MysqlProjectRepository";
import { RabbitPublisher } from "./infrastructure/messaging/RabbitPublisher";
import { RabbitConsumer } from "./infrastructure/messaging/RabbitConsumer";
import { startProjectServer } from "./infrastructure/http/server";

async function main() {
  const repo = new MysqlProjectRepository();
  await repo.init();

  const publisher = new RabbitPublisher();
  await publisher.init();

  const consumer = new RabbitConsumer(repo);
  await consumer.init();

  startProjectServer(repo, publisher, Number(process.env.PORT || 3003));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});