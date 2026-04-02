import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationResponseDto } from '../utils/pagination/pagination-response.dto';
import { Part } from './domain/part';
import { CreatePartDto } from './dto/create-part.dto';
import { FindPartsDto } from './dto/find-parts.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { PartsService } from './parts.service';

@ApiTags('parts')
@Controller({ path: 'parts', version: '1' })
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post()
  @ApiCreatedResponse({ type: Part })
  @ApiOperation({ summary: 'Criar peca em estoque' })
  async create(@Body() payload: CreatePartDto): Promise<Part> {
    return await this.partsService.create(payload);
  }

  @Get()
  @ApiOkResponse({ type: PaginationResponseDto<Part> })
  @ApiOperation({ summary: 'Listar pecas com paginacao' })
  async findAll(
    @Query() query: FindPartsDto,
  ): Promise<PaginationResponseDto<Part>> {
    return await this.partsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Part })
  @ApiOperation({ summary: 'Buscar peca por id' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Part> {
    return await this.partsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Part })
  @ApiOperation({ summary: 'Atualizar dados da peca' })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdatePartDto,
  ): Promise<Part> {
    return await this.partsService.update(id, payload);
  }
}
