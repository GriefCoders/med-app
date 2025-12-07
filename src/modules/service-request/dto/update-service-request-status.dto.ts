import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceRequestStatus } from 'src/types/service-request-status';

export class UpdateServiceRequestStatusDto {
  @ApiProperty({
    description: 'Новый статус заявки',
    enum: ServiceRequestStatus,
    example: ServiceRequestStatus.IN_PROGRESS,
  })
  @IsEnum(ServiceRequestStatus)
  status: ServiceRequestStatus;

  @ApiProperty({
    description: 'Комментарий к заявке при смене статуса',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
