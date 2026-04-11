import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    description: 'Listado de permisos a actualizar para el rol',
    example: [
      {
        moduleId: '9c4f2d10-4f0a-4ac8-9258-a5eb5e7f9e65',
        permissionCatalogId: 'ceac4aa4-f78b-4f35-97aa-8f8f8bd8f335',
        isGranted: true,
      },
    ],
    type: [Object],
  })
  @IsArray()
  permissions!: any[];
}
