import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ServiceRequestStatus } from 'src/types/service-request-status';

export class UpdateServiceRequestStatusDto {
  @ApiProperty({
    description: 'Новый статус заявки',
    enum: ServiceRequestStatus,
    example: ServiceRequestStatus.IN_PROGRESS,
  })
  @IsEnum(ServiceRequestStatus)
  status: ServiceRequestStatus;
}
