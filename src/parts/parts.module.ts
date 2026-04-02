import { Module } from '@nestjs/common';
import { PriorityService } from './domain/services/priority.service';
import { RelationalPartPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { PartsController } from './parts.controller';
import { RestockController } from './restock.controller';
import { PartsService } from './parts.service';

@Module({
  imports: [RelationalPartPersistenceModule],
  providers: [PartsService, PriorityService],
  controllers: [PartsController, RestockController],
  exports: [PartsService],
})
export class PartsModule {}
