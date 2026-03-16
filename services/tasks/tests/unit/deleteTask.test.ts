import { buildTaskRoutes } from "../../src/infrastructure/http/routes";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

test("it removes task correctly", async () => {
  const fakeDb = {
    removeTask: jest.fn(),
    getTask: jest.fn(),
  };

  const fakeBus = {
    publish: jest.fn(),
  };

  const userId = "user-123";

  fakeDb.getTask.mockResolvedValue({
    id: "12345",
    projectId: "project-1",
    status: "OPEN",
  });

  const req = {
    params: { id: "12345" },
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
      l.route.path === "/tasks/:id" &&
      l.route.methods.delete
  );

  expect(layer).toBeDefined();

  const handler = (layer as any).route.stack[0].handle;

  await handler(req as any, res as any, next);

  expect(fakeDb.removeTask.mock.calls.length).toBe(1);
  expect(fakeDb.removeTask.mock.calls[0][0]).toBe(req.params.id);
  expect(fakeDb.removeTask.mock.calls[0][1]).toEqual(userId);

  expect(res.json.mock.calls[0].length).toBe(1);
  expect(res.json.mock.calls[0][0]).toEqual({ ok: true });
});