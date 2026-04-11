import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const authService = {
    login: jest.fn(),
  };

  const controller = new AuthController(authService as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call authService.login with dto', async () => {
    const dto = { username: 'admin', password: 'secret' };
    const expected = { token: 'jwt', user: { id: '1' } };
    authService.login.mockResolvedValue(expected);

    const result = await controller.login(dto as any);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });
});
