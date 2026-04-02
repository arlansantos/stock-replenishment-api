import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { OrderDirection } from '../enums/order-direction.enum';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1, description: 'Número da página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    default: 10,
    description: 'Número de itens por página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    default: 'id',
    description: 'Campo para ordenação dos resultados',
  })
  @IsString()
  @IsOptional()
  orderBy: string;

  @ApiPropertyOptional({
    enum: OrderDirection,
    default: OrderDirection.DESC,
    description: 'Direção da ordenação (ASC ou DESC)',
  })
  @IsEnum(OrderDirection)
  @IsOptional()
  orderDirection: OrderDirection = OrderDirection.DESC;
}
