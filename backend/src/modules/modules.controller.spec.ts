import { ModulesController } from './modules.controller';

describe('ModulesController', () => {
  const modulesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByRole: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const controller = new ModulesController(modulesService as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create module', async () => {
    const dto = { name: 'Dashboard' };
    modulesService.create.mockResolvedValue({ id: '1', ...dto });

    await controller.create(dto as any);

    expect(modulesService.create).toHaveBeenCalledWith(dto);
  });

  it('should get all modules', async () => {
    modulesService.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(modulesService.findAll).toHaveBeenCalled();
  });

  it('should get modules by role', async () => {
    modulesService.findByRole.mockResolvedValue([]);

    await controller.findByRole('r1');

    expect(modulesService.findByRole).toHaveBeenCalledWith('r1');
  });

  it('should get one module', async () => {
    modulesService.findOne.mockResolvedValue({ id: '1' });

    await controller.findOne('1');

    expect(modulesService.findOne).toHaveBeenCalledWith('1');
  });

  it('should update module', async () => {
    const dto = { name: 'Users' };
    modulesService.update.mockResolvedValue({ id: '1', ...dto });

    await controller.update('1', dto as any);

    expect(modulesService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove module', async () => {
    modulesService.remove.mockResolvedValue(undefined);

    await controller.remove('1');

    expect(modulesService.remove).toHaveBeenCalledWith('1');
  });
});
