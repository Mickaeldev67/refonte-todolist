import { buildTaskRoutes } from "../../src/infrastructure/http/routes";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

test("it gets tasks correctly", async () => {
  const ITEMS = [{ id: "12345" }];

  const fakeDb = {
    getTasks: jest.fn().mockResolvedValue(ITEMS),
  };

  const fakeBus = {
    publish: jest.fn(),
  };

  const userId = "user-123";

  const req = {
    header: jest.fn().mockReturnValue(userId),
  };

  const res = {
    json: jest.fn(),
  };

  const next = jest.fn();

  const router = buildTaskRoutes(fakeDb as any, fakeBus as any);

  const layer = router.stack.find(
    (l: any) =>
      l.route &&
      l.route.path === "/tasks" &&
      l.route.methods.get
  );

  expect(layer).toBeDefined();

  const handler = (layer as any).route.stack[0].handle;

  await handler(req as any, res as any, next);

  expect(fakeDb.getTasks.mock.calls.length).toBe(1);
  expect(fakeDb.getTasks.mock.calls[0][0]).toEqual(userId);

  expect(res.json.mock.calls[0].length).toBe(1);
  expect(res.json.mock.calls[0][0]).toEqual(ITEMS);
});