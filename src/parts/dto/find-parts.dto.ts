import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../utils/pagination/pagination-query.dto';
import { CriticalityLevelEnum } from '../enums/criticality-level.enum';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class FindPartsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Categoria da peca', example: 'engine' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Nivel de criticidade',
    enum: CriticalityLevelEnum,
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(CriticalityLevelEnum)
  criticalityLevel?: CriticalityLevelEnum;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filtra apenas pecas com necessidade de reposicao',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  @IsBoolean()
  needsRestock?: boolean;
}
