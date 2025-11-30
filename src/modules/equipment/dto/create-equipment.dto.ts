import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty({ description: 'Название инвентаря' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Описание инвентаря', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Инвентарный номер',
    required: false,
    example: 'INV-0001',
  })
  @IsOptional()
  @IsString()
  inventoryNumber?: string;

  @ApiProperty({ description: 'Идентификатор отделения' })
  @IsString()
  siteId: string;

  @ApiProperty({
    description: 'Серийный номер',
    required: false,
    example: 'SN-0001',
  })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({
    description: 'Состояние',
    required: false,
    example: 'Рабочее',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Номер комнаты',
    required: false,
    example: '101',
  })
  @IsOptional()
  @IsString()
  roomNumber?: string;
}


