import { PermissionCatalogsController } from './permission-catalogs.controller';

describe('PermissionCatalogsController', () => {
  const svc = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addMappings: jest.fn(),
    getMappingsByPermission: jest.fn(),
    removeMapping: jest.fn(),
  };

  const controller = new PermissionCatalogsController(svc as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all catalogs', async () => {
    svc.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(svc.findAll).toHaveBeenCalled();
  });

  it('should get one catalog', async () => {
    svc.findOne.mockResolvedValue({ id: '1' });

    await controller.findOne('1');

    expect(svc.findOne).toHaveBeenCalledWith('1');
  });

  it('should create catalog', async () => {
    const body = { nombre: 'Leer', descripcion: 'Permiso para leer', icono: 'visibility' };
    svc.create.mockResolvedValue({ id: '1', ...body });

    await controller.create(body);

    expect(svc.create).toHaveBeenCalledWith(body);
  });

  it('should update catalog', async () => {
    const body = { nombre: 'Nuevo nombre' };
    svc.update.mockResolvedValue({ id: '1', ...body });

    await controller.update('1', body);

    expect(svc.update).toHaveBeenCalledWith('1', body);
  });

  it('should remove catalog', async () => {
    svc.remove.mockResolvedValue(undefined);

    await controller.remove('1');

    expect(svc.remove).toHaveBeenCalledWith('1');
  });

  it('should add mappings', async () => {
    svc.addMappings.mockResolvedValue({ ok: true });

    await controller.addMappings('p1', { catalogIds: ['c1', 'c2'] });

    expect(svc.addMappings).toHaveBeenCalledWith('p1', ['c1', 'c2']);
  });

  it('should get mappings by permission', async () => {
    svc.getMappingsByPermission.mockResolvedValue([]);

    await controller.getMappings('p1');

    expect(svc.getMappingsByPermission).toHaveBeenCalledWith('p1');
  });

  it('should remove mapping', async () => {
    svc.removeMapping.mockResolvedValue(undefined);

    await controller.removeMapping('p1', 'c1');

    expect(svc.removeMapping).toHaveBeenCalledWith('p1', 'c1');
  });
});
