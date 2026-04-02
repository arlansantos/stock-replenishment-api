import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from './pagination-query.dto';

export class PaginationMetaDto {
  @ApiProperty({
    type: Number,
    description: 'Número de itens na página atual',
  })
  readonly itemCount: number;
  @ApiProperty({
    type: Number,
    description: 'Número total de itens',
  })
  readonly totalItems: number;
  @ApiProperty({
    type: Number,
    description: 'Número de itens por página',
  })
  readonly itemsPerPage: number;
  @ApiProperty({
    type: Number,
    description: 'Número total de páginas',
  })
  readonly totalPages: number;
  @ApiProperty({
    type: Number,
    description: 'Página atual',
  })
  readonly currentPage: number;
  @ApiProperty({
    type: Boolean,
    description: 'Indica se há uma próxima página',
  })
  readonly hasNextPage: boolean;
  @ApiProperty({
    type: Boolean,
    description: 'Indica se há uma página anterior',
  })
  readonly hasPreviousPage: boolean;

  constructor(
    itemCount: number,
    totalItems: number,
    paginationQuery: PaginationQueryDto,
  ) {
    const { page, limit } = paginationQuery;

    this.itemCount = itemCount;
    this.totalItems = totalItems;
    this.itemsPerPage = limit;
    this.currentPage = page;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.hasPreviousPage = this.currentPage > 1;
    this.hasNextPage = this.currentPage < this.totalPages;
  }
}

export class PaginationResponseDto<T> {
  readonly data: T[];
  readonly meta: PaginationMetaDto;

  constructor(
    data: T[],
    totalItems: number,
    paginationQuery: PaginationQueryDto,
  ) {
    this.data = data;
    this.meta = new PaginationMetaDto(data.length, totalItems, paginationQuery);
  }
}
