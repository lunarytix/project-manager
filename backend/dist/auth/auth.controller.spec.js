"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./auth.controller");
describe('AuthController', () => {
    const authService = {
        login: jest.fn(),
    };
    const controller = new auth_controller_1.AuthController(authService);
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should call authService.login with dto', async () => {
        const dto = { username: 'admin', password: 'secret' };
        const expected = { token: 'jwt', user: { id: '1' } };
        authService.login.mockResolvedValue(expected);
        const result = await controller.login(dto);
        expect(authService.login).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expected);
    });
});
