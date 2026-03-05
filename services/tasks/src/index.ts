import { MysqlTaskRepository } from "./infrastructure/db/MysqlTaskRepository";
import { RabbitPublisher } from "./infrastructure/messaging/RabbitPublisher";
import { startTaskServer } from "./infrastructure/http/server";

async function main() {
  const repo = new MysqlTaskRepository();
  await repo.init();

  const bus = new RabbitPublisher();
  await bus.init();

  startTaskServer(repo, bus, Number(process.env.PORT || 3002));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});