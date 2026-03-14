import { buildProjectRoutes } from '../../../services/projects/src/infrastructure/http/routes';

jest.mock('uuid', () => ({ v4: jest.fn(() => 'project-1') }));

test('POST /projects crée un projet', async () => {
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