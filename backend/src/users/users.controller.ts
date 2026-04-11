import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private static imageFileName(_req: any, file: any, callback: (error: Error | null, filename: string) => void) {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = extname(file.originalname || '').toLowerCase();
    callback(null, `profile-${suffix}${extension}`);
  }

  @ApiOperation({ summary: 'Crear usuario' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Listar usuarios' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', example: '3b6db4f4-9c2f-454f-a06e-08d6e16f24db' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar usuario (PATCH)' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Actualizar usuario (PUT)' })
  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Subir foto de perfil de usuario' })
  @ApiParam({ name: 'id', example: '3b6db4f4-9c2f-454f-a06e-08d6e16f24db' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (jpg, jpeg, png, webp, gif)',
        },
      },
      required: ['photo'],
    },
  })
  @Post(':id/photo')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: 'uploads/profile',
      filename: UsersController.imageFileName
    }),
    fileFilter: (_req, file, callback) => {
      const allowed = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.originalname || '');
      callback(allowed ? null : new BadRequestException('Formato de imagen no permitido'), allowed);
    },
    limits: { fileSize: 5 * 1024 * 1024 }
  }))
  async uploadPhoto(@Param('id') id: string, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Debes seleccionar una imagen');
    }

    const photoPath = `/uploads/profile/${file.filename}`;
    const updated = await this.usersService.update(id, { photo: photoPath });
    return {
      message: 'Imagen de perfil actualizada',
      photo: photoPath,
      user: updated
    };
  }

  @ApiOperation({ summary: 'Eliminar usuario' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'Listar usuarios por rol' })
  @ApiParam({ name: 'roleId', example: '9ab9b471-5f58-4056-99fd-8fdb0fb6563b' })
  @Get('role/:roleId')
  findByRole(@Param('roleId') roleId: string) {
    return this.usersService.findByRole(roleId);
  }
}
