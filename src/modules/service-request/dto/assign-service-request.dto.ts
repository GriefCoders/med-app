import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignServiceRequestDto {
  @ApiProperty({
    description: 'Идентификатор инженера, которому назначается заявка',
  })
  @IsString()
  assigneeId: string;
}


