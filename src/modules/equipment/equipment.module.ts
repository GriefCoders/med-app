import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { EquipmentRepository } from './equipment.repository';

@Module({
  providers: [EquipmentService, EquipmentRepository],
  controllers: [EquipmentController],
  exports: [EquipmentService],
})
export class EquipmentModule {}


