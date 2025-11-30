import { Module } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestController } from './service-request.controller';
import { ServiceRequestRepository } from './service-request.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [ServiceRequestService, ServiceRequestRepository],
  controllers: [ServiceRequestController],
})
export class ServiceRequestModule {}


