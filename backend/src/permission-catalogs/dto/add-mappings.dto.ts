import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddMappingsDto {
  @ApiProperty({
    description: 'IDs de catalogos que se asociaran al permiso',
    type: [String],
    example: [
      'ceac4aa4-f78b-4f35-97aa-8f8f8bd8f335',
      '793f9990-6af0-463e-8fd0-0eff1a93a48f',
    ],
  })
  @IsArray()
  catalogIds!: string[];
}
