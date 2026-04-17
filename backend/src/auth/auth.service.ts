import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  private isUuid(value?: string): boolean {
    if (!value) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let roleName = user.roleId;
    if (this.isUuid(user.roleId)) {
      const role = await this.roleRepository.findOne({ where: { id: user.roleId } as any });
      roleName = role?.nombre || user.roleId;
    }

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      roleId: user.roleId,
      roleName,
      photo: user.photo,
      token: 'fake-jwt-token-' + user.id
    };
  }
}
