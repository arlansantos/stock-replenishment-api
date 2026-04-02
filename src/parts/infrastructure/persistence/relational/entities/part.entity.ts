import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CriticalityLevelEnum } from '../../../../enums/criticality-level.enum';

@Entity({ name: 'parts' })
export class PartEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 120 })
  category!: string;

  @Column({ name: 'current_stock', type: 'int' })
  currentStock!: number;

  @Column({ name: 'minimum_stock', type: 'int' })
  minimumStock!: number;

  @Column({
    name: 'average_daily_sales',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  averageDailySales!: number;

  @Column({ name: 'lead_time_days', type: 'int' })
  leadTimeDays!: number;

  @Column({ name: 'unit_cost', type: 'numeric', precision: 12, scale: 2 })
  unitCost!: number;

  @Column({ name: 'criticality_level', type: 'smallint' })
  criticalityLevel!: CriticalityLevelEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
