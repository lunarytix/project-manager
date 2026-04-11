import { PermissionsController } from './permissions.controller';

describe('PermissionsController', () => {
  const service = {
    findAll: jest.fn(),
    findByRole: jest.fn(),
    findByModule: jest.fn(),
    updateRolePermissions: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const controller = new PermissionsController(service as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all permissions', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get permissions by role', async () => {
    service.findByRole.mockResolvedValue([]);

    await controller.findByRole('r1');

    expect(service.findByRole).toHaveBeenCalledWith('r1');
  });

  it('should get permissions by module', async () => {
    service.findByModule.mockResolvedValue([]);

    await controller.findByModule('m1');

    expect(service.findByModule).toHaveBeenCalledWith('m1');
  });

  it('should update role permissions', async () => {
    const permissions = [{ moduleId: 'm1', canRead: true }];
    service.updateRolePermissions.mockResolvedValue({ ok: true });

    await controller.updateRolePermissions('r1', { permissions });

    expect(service.updateRolePermissions).toHaveBeenCalledWith('r1', permissions);
  });

  it('should create permission', async () => {
    const dto = { roleId: 'r1', moduleId: 'm1' };
    service.create.mockResolvedValue({ id: '1', ...dto });

    await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update permission', async () => {
    const dto = { canWrite: true };
    service.update.mockResolvedValue({ id: '1', ...dto });

    await controller.update('1', dto as any);

    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove permission', async () => {
    service.remove.mockResolvedValue(undefined);

    await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
