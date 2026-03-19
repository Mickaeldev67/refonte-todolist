import { SqliteTaskRepository } from "../../src/infrastructure/db/SqliteTaskRepository";

describe("SqliteTaskRepository", () => {
  let db: SqliteTaskRepository;

  const userId = "user-1";

  const TASK = {
    id: "task-1",
    name: "Tâche test",
    status: "OPEN" as const,
    projectId: "project-1",
  };

  beforeEach(async () => {
    db = new SqliteTaskRepository(":memory:");
    await db.init();
  });

  afterEach(async () => {
    await db.teardown();
  });

  test("it initializes correctly", async () => {
    const repo = new SqliteTaskRepository(":memory:");
    await repo.init();
    await repo.teardown();
  });

  test("it can store and retrieve tasks", async () => {
    await db.storeTask(TASK, userId);

    const tasks = await db.getTasks(userId);

    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual(TASK);
  });

  test("it can get a single task", async () => {
    await db.storeTask(TASK, userId);

    const task = await db.getTask(TASK.id, userId);

    expect(task).toEqual(TASK);
  });

  test("it can update an existing task", async () => {
    await db.storeTask(TASK, userId);

    await db.updateTask(
      TASK.id,
      {
        ...TASK,
        name: "Tâche modifiée",
        status: "CLOSED",
      },
      userId,
    );

    const task = await db.getTask(TASK.id, userId);

    expect(task).toEqual({
      id: "task-1",
      name: "Tâche modifiée",
      status: "CLOSED",
      projectId: "project-1",
    });
  });

  test("it can remove an existing task", async () => {
    await db.storeTask(TASK, userId);

    await db.removeTask(TASK.id, userId);

    const tasks = await db.getTasks(userId);

    expect(tasks).toHaveLength(0);
  });

  test("it isolates tasks by user", async () => {
    await db.storeTask(TASK, userId);

    const tasks = await db.getTasks("other-user");

    expect(tasks).toHaveLength(0);
  });

  test("it does not return a task belonging to another user", async () => {
    await db.storeTask(TASK, userId);

    const task = await db.getTask(TASK.id, "other-user");

    expect(task).toBeUndefined();
  });

  test("it can store and retrieve a project view", async () => {
    await db.upsertProjectView("project-1", "Projet A", "OPEN");

    const projectView = await db.getProjectView("project-1");

    expect(projectView).toEqual({
      projectId: "project-1",
      projectName: "Projet A",
      status: "OPEN",
    });
  });

  test("it can update an existing project view", async () => {
    await db.upsertProjectView("project-1", "Projet A", "OPEN");
    await db.upsertProjectView("project-1", "Projet A modifié", "CLOSED");

    const projectView = await db.getProjectView("project-1");

    expect(projectView).toEqual({
      projectId: "project-1",
      projectName: "Projet A modifié",
      status: "CLOSED",
    });
  });

  test("it can store a project view with a null name", async () => {
    await db.upsertProjectView("project-1", null, "OPEN");

    const projectView = await db.getProjectView("project-1");

    expect(projectView).toEqual({
      projectId: "project-1",
      projectName: null,
      status: "OPEN",
    });
  });

  test("it returns undefined when project view does not exist", async () => {
    const projectView = await db.getProjectView("unknown-project");

    expect(projectView).toBeUndefined();
  });
});