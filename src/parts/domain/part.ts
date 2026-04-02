import { ApiProperty } from '@nestjs/swagger';
import { CriticalityLevelEnum } from '../enums/criticality-level.enum';

export type CreatePartProps = {
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  averageDailySales: number;
  leadTimeDays: number;
  unitCost: number;
  criticalityLevel: CriticalityLevelEnum;
};

export class Part {
  @ApiProperty({ type: String, format: 'uuid' })
  id!: string;

  @ApiProperty({ type: String, example: 'Filtro de Oleo X' })
  name!: string;

  @ApiProperty({ type: String, example: 'engine' })
  category!: string;

  @ApiProperty({ type: Number, example: 15 })
  currentStock!: number;

  @ApiProperty({ type: Number, example: 20 })
  minimumStock!: number;

  @ApiProperty({ type: Number, example: 4 })
  averageDailySales!: number;

  @ApiProperty({ type: Number, example: 5 })
  leadTimeDays!: number;

  @ApiProperty({ type: Number, example: 18.5 })
  unitCost!: number;

  @ApiProperty({
    enum: CriticalityLevelEnum,
    example: CriticalityLevelEnum.MEDIUM,
  })
  criticalityLevel!: CriticalityLevelEnum;

  @ApiProperty({ type: Date })
  createdAt!: Date;

  @ApiProperty({ type: Date })
  updatedAt!: Date;

  static create(props: CreatePartProps): Part {
    const part = new Part();
    part.name = props.name;
    part.category = props.category;
    part.currentStock = props.currentStock;
    part.minimumStock = props.minimumStock;
    part.averageDailySales = props.averageDailySales;
    part.leadTimeDays = props.leadTimeDays;
    part.unitCost = props.unitCost;
    part.criticalityLevel = props.criticalityLevel;

    return part;
  }

  calculateExpectedConsumption(): number {
    return this.averageDailySales * this.leadTimeDays;
  }

  calculateProjectedStock(): number {
    return this.currentStock - this.calculateExpectedConsumption();
  }

  needsRestock(): boolean {
    return this.calculateProjectedStock() < this.minimumStock;
  }

  calculateUrgencyScore(): number {
    return (
      (this.minimumStock - this.calculateProjectedStock()) *
      this.criticalityLevel
    );
  }
}
