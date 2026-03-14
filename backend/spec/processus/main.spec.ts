import { buildProjectRoutes } from '../../../services/projects/src/infrastructure/http/routes';
import { buildTaskRoutes } from '../../../services/tasks/src/infrastructure/http/routes';
import { v4 as uuid } from 'uuid';

jest.mock('uuid', () => ({ v4: jest.fn() }));

test('POST /projects crée un projet', async () => {
  (uuid as jest.Mock).mockReturnValue('project-1');

  const repo = {
    getProjects: jest.fn(),
    getProject: jest.fn(),
    storeProject: jest.fn().mockResolvedValue(undefined),
    updateProject: jest.fn(),
    removeProject: jest.fn(),
    incrementOpenTasks: jest.fn(),
    closeTask: jest.fn(),
    reopenTask: jest.fn(),
    deleteTask: jest.fn(),
    teardown: jest.fn(),
  };
  const bus = { publish: jest.fn().mockResolvedValue(undefined) };

  const router = buildProjectRoutes(repo as any, bus as any);
  const postLayer = (router as any).stack.find((l: any) => l.route?.path === '/projects' && l.route.methods.post);
  const handler = postLayer.route.stack[0].handle;

  const req = { header: (k: string) => (k === 'X-User-Id' ? 'user-1' : ''), body: { name: 'Projet A' } } as any;
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

  await handler(req, res);

  expect(repo.storeProject).toHaveBeenCalledWith(expect.objectContaining({
    id: 'project-1',
    userId: 'user-1',
    name: 'Projet A',
    status: 'OPEN',
  }));
  expect(bus.publish).toHaveBeenCalledWith('project.created', expect.objectContaining({
    projectId: 'project-1',
    userId: 'user-1',
  }));
  expect(res.json).toHaveBeenCalled();
});

test('POST /tasks crée une tâche sur un projet', async () => {
  (uuid as jest.Mock).mockReturnValue('task-1');

  const repo = {
    getTasks: jest.fn(),
    getTask: jest.fn(),
    storeTask: jest.fn().mockResolvedValue(undefined),
    updateTask: jest.fn(),
    removeTask: jest.fn(),
    getProjectView: jest.fn(),
    upsertProjectView: jest.fn(),
    teardown: jest.fn(),
  };
  const bus = { publish: jest.fn().mockResolvedValue(undefined) };

  const router = buildTaskRoutes(repo as any, bus as any);
  const postLayer = (router as any).stack.find((l: any) => l.route?.path === '/tasks' && l.route.methods.post);
  const handler = postLayer.route.stack[0].handle;

  const req = {
    header: (k: string) => (k === 'X-User-Id' ? 'user-1' : ''),
    body: { name: 'Tâche A', projectId: 'project-1' },
  } as any;
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

  await handler(req, res);

  expect(repo.storeTask).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'task-1',
      name: 'Tâche A',
      status: 'OPEN',
      projectId: 'project-1',
    }),
    'user-1',
  );
  expect(bus.publish).toHaveBeenCalledWith(
    'task.created',
    expect.objectContaining({
      taskId: 'task-1',
      projectId: 'project-1',
      userId: 'user-1',
      status: 'OPEN',
    }),
  );
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'task-1',
      name: 'Tâche A',
      projectId: 'project-1',
      status: 'OPEN',
    }),
  );
});