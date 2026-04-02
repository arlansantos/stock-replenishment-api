import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartAbstractRepository } from '../../../part.abstract.repository';
import { PartEntity } from './entities/part.entity';
import { PartRelationalRepository } from './repositories/part.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PartEntity])],
  providers: [
    {
      provide: PartAbstractRepository,
      useClass: PartRelationalRepository,
    },
  ],
  exports: [PartAbstractRepository],
})
export class RelationalPartPersistenceModule {}
