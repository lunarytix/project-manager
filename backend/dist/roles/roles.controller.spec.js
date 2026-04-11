"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roles_controller_1 = require("./roles.controller");
describe('RolesController', () => {
    const rolesService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };
    const controller = new roles_controller_1.RolesController(rolesService);
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should create role', async () => {
        const dto = { name: 'Admin' };
        rolesService.create.mockResolvedValue({ id: '1', ...dto });
        await controller.create(dto);
        expect(rolesService.create).toHaveBeenCalledWith(dto);
    });
    it('should get all roles', async () => {
        rolesService.findAll.mockResolvedValue([]);
        await controller.findAll();
        expect(rolesService.findAll).toHaveBeenCalled();
    });
    it('should get one role', async () => {
        rolesService.findOne.mockResolvedValue({ id: '1' });
        await controller.findOne('1');
        expect(rolesService.findOne).toHaveBeenCalledWith('1');
    });
    it('should update role', async () => {
        const dto = { name: 'Editor' };
        rolesService.update.mockResolvedValue({ id: '1', ...dto });
        await controller.update('1', dto);
        expect(rolesService.update).toHaveBeenCalledWith('1', dto);
    });
    it('should remove role', async () => {
        rolesService.remove.mockResolvedValue(undefined);
        await controller.remove('1');
        expect(rolesService.remove).toHaveBeenCalledWith('1');
    });
});
