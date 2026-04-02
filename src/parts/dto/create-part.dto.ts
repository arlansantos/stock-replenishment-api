import { ApiProperty } from '@nestjs/swagger';
import { CriticalityLevelEnum } from '../enums/criticality-level.enum';
import { IsEnum, IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreatePartDto {
  @ApiProperty({ description: 'Nome da peca', example: 'Filtro de Oleo X' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Categoria da peca', example: 'engine' })
  @IsString()
  category!: string;

  @ApiProperty({ description: 'Estoque atual', example: 15 })
  @IsInt()
  @Min(0)
  currentStock!: number;

  @ApiProperty({ description: 'Estoque minimo', example: 20 })
  @IsInt()
  @Min(0)
  minimumStock!: number;

  @ApiProperty({ description: 'Vendas diarias medias', example: 4 })
  @IsNumber()
  @Min(0)
  averageDailySales!: number;

  @ApiProperty({ description: 'Tempo de lead em dias', example: 5 })
  @IsInt()
  @Min(1)
  leadTimeDays!: number;

  @ApiProperty({ description: 'Custo unitario', example: 18.5 })
  @IsNumber()
  @Min(0)
  unitCost!: number;

  @ApiProperty({
    enum: CriticalityLevelEnum,
    description: 'Nivel de criticidade',
    example: CriticalityLevelEnum.MEDIUM,
  })
  @IsEnum(CriticalityLevelEnum)
  @Min(1)
  @Max(5)
  criticalityLevel!: CriticalityLevelEnum;
}
