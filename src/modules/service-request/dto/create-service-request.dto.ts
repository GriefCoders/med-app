import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateServiceRequestDto {
  @ApiProperty({ description: 'Краткое описание проблемы' })
  @IsString()
  summary: string;

  @ApiProperty({
    description: 'Подробное описание проблемы',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Тип заявки (например, инцидент, запрос)',
    required: false,
    example: 'инцидент',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Приоритет заявки',
    required: false,
    example: 'средний',
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({
    description: 'Идентификатор оборудования, к которому относится заявка',
    required: false,
  })
  @IsOptional()
  @IsString()
  equipmentId?: string;
}
