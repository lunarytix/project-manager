import { BadRequestException } from '@nestjs/common';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  const usersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByRole: jest.fn(),
  };

  const controller = new UsersController(usersService as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create user', async () => {
    const dto = { username: 'u1' };
    const expected = { id: '1', ...dto };
    usersService.create.mockResolvedValue(expected);

    const result = await controller.create(dto as any);

    expect(usersService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('should return all users', async () => {
    const expected = [{ id: '1' }];
    usersService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();

    expect(usersService.findAll).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('should return one user', async () => {
    const expected = { id: '1' };
    usersService.findOne.mockResolvedValue(expected);

    const result = await controller.findOne('1');

    expect(usersService.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual(expected);
  });

  it('should update user with patch', async () => {
    const dto = { fullName: 'Updated' };
    const expected = { id: '1', ...dto };
    usersService.update.mockResolvedValue(expected);

    const result = await controller.update('1', dto as any);

    expect(usersService.update).toHaveBeenCalledWith('1', dto);
    expect(result).toEqual(expected);
  });

  it('should update user with put', async () => {
    const dto = { fullName: 'Updated Put' };
    const expected = { id: '1', ...dto };
    usersService.update.mockResolvedValue(expected);

    const result = await controller.updatePut('1', dto as any);

    expect(usersService.update).toHaveBeenCalledWith('1', dto);
    expect(result).toEqual(expected);
  });

  it('should remove user', async () => {
    usersService.remove.mockResolvedValue(undefined);

    await controller.remove('1');

    expect(usersService.remove).toHaveBeenCalledWith('1');
  });

  it('should return users by role', async () => {
    const expected = [{ id: '1', roleId: 'r1' }];
    usersService.findByRole.mockResolvedValue(expected);

    const result = await controller.findByRole('r1');

    expect(usersService.findByRole).toHaveBeenCalledWith('r1');
    expect(result).toEqual(expected);
  });

  it('should upload photo and persist path', async () => {
    const file = { filename: 'photo-1.png' };
    const updatedUser = { id: '1', photo: '/uploads/profile/photo-1.png' };
    usersService.update.mockResolvedValue(updatedUser);

    const result = await controller.uploadPhoto('1', file);

    expect(usersService.update).toHaveBeenCalledWith('1', {
      photo: '/uploads/profile/photo-1.png',
    });
    expect(result).toEqual({
      message: 'Imagen de perfil actualizada',
      photo: '/uploads/profile/photo-1.png',
      user: updatedUser,
    });
  });

  it('should reject upload when file is missing', async () => {
    await expect(controller.uploadPhoto('1', undefined)).rejects.toBeInstanceOf(BadRequestException);
  });
});
