import { v4 as uuid } from "uuid";
import { buildCreateTaskHandler } from "../../src/infrastructure/http/routes";

jest.mock("uuid", () => ({ v4: jest.fn() }));

test("it stores task correctly", async () => {
  const fakeRepo = {
    storeTask: jest.fn(),
  };

  const fakeBus = {
    publish: jest.fn(),
  };

  const id = "something-not-a-uuid";
  const name = "A sample task";
  const projectId = "project-123";
  const userId = "user-123";

  const req = {
    body: { name, projectId },
    header: jest.fn((headerName: string) => {
      if (headerName === "X-User-Id") return userId;
      return undefined;
    }),
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  (uuid as jest.Mock).mockReturnValue(id);

  const handler = buildCreateTaskHandler(fakeRepo as any, fakeBus as any);
  await handler(req as any, res as any);

  const expectedTask = { id, name, status: "OPEN", projectId };

  expect(fakeRepo.storeTask.mock.calls.length).toBe(1);
  expect(fakeRepo.storeTask.mock.calls[0][0]).toEqual(expectedTask);
  expect(fakeRepo.storeTask.mock.calls[0][1]).toEqual(userId);

  expect(fakeBus.publish.mock.calls.length).toBe(1);
  expect(fakeBus.publish.mock.calls[0][0]).toEqual("task.created");
  expect(fakeBus.publish.mock.calls[0][1]).toEqual({
    taskId: id,
    projectId,
    userId,
    status: "OPEN",
  });

  expect(res.json.mock.calls[0].length).toBe(1);
  expect(res.json.mock.calls[0][0]).toEqual(expectedTask);
});