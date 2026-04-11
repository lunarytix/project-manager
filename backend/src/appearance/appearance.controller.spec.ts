import { AppearanceController } from './appearance.controller';

describe('AppearanceController', () => {
  const appearanceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findDefault: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    setAsDefault: jest.fn(),
  };

  const controller = new AppearanceController(appearanceService as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create appearance', async () => {
    const dto = { name: 'Tema azul' };
    appearanceService.create.mockResolvedValue({ id: '1', ...dto });

    await controller.create(dto as any);

    expect(appearanceService.create).toHaveBeenCalledWith(dto);
  });

  it('should get all appearances', async () => {
    appearanceService.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(appearanceService.findAll).toHaveBeenCalled();
  });

  it('should get default appearance', async () => {
    appearanceService.findDefault.mockResolvedValue({ id: 'default' });

    await controller.findDefault();

    expect(appearanceService.findDefault).toHaveBeenCalled();
  });

  it('should get one appearance', async () => {
    appearanceService.findOne.mockResolvedValue({ id: '1' });

    await controller.findOne('1');

    expect(appearanceService.findOne).toHaveBeenCalledWith('1');
  });

  it('should update appearance', async () => {
    const dto = { logoUrl: 'logo.png' };
    appearanceService.update.mockResolvedValue({ id: '1', ...dto });

    await controller.update('1', dto as any);

    expect(appearanceService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove appearance', async () => {
    appearanceService.remove.mockResolvedValue(undefined);

    await controller.remove('1');

    expect(appearanceService.remove).toHaveBeenCalledWith('1');
  });

  it('should set appearance as default', async () => {
    appearanceService.setAsDefault.mockResolvedValue({ id: '1', isDefault: true });

    await controller.setAsDefault('1');

    expect(appearanceService.setAsDefault).toHaveBeenCalledWith('1');
  });
});
