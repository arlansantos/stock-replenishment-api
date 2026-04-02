import { ApiProperty } from '@nestjs/swagger';

export class RestockPriorityItemDto {
  @ApiProperty({ type: String, format: 'uuid' })
  partId!: string;

  @ApiProperty({ type: String, example: 'Filtro de Oleo X' })
  name!: string;

  @ApiProperty({ type: Number, example: 15 })
  currentStock!: number;

  @ApiProperty({ type: Number, example: 5 })
  projectedStock!: number;

  @ApiProperty({ type: Number, example: 20 })
  minimumStock!: number;

  @ApiProperty({ type: Number, example: 45 })
  urgencyScore!: number;
}

export class RestockPrioritiesResponseDto {
  @ApiProperty({
    type: [RestockPriorityItemDto],
    description: 'Lista de pecas ordenadas por prioridade de reposicao',
  })
  priorities!: RestockPriorityItemDto[];
}
