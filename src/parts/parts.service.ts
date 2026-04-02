import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationResponseDto } from '../utils/pagination/pagination-response.dto';
import { Part } from './domain/part';
import { PriorityService } from './domain/services/priority.service';
import { CreatePartDto } from './dto/create-part.dto';
import { FindPartsDto } from './dto/find-parts.dto';
import { RestockPrioritiesResponseDto } from './dto/restock-priorities-response.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { PartAbstractRepository } from './part.abstract.repository';

@Injectable()
export class PartsService {
  constructor(
    private readonly repository: PartAbstractRepository,
    private readonly priorityService: PriorityService,
  ) {}

  async create(payload: CreatePartDto): Promise<Part> {
    const part = Part.create(payload);
    return await this.repository.create(part);
  }

  async findAll(query: FindPartsDto): Promise<PaginationResponseDto<Part>> {
    const [parts, total] = await this.repository.findAllWithPagination(query);
    return new PaginationResponseDto(parts, total, query);
  }

  async findOne(id: string): Promise<Part> {
    const part = await this.repository.findById(id);

    if (!part) {
      throw new NotFoundException('Peca nao encontrada');
    }

    return part;
  }

  async update(id: string, payload: UpdatePartDto): Promise<Part> {
    const updated = await this.repository.update(id, {
      name: payload.name,
      category: payload.category,
      currentStock: payload.currentStock,
      minimumStock: payload.minimumStock,
      averageDailySales: payload.averageDailySales,
      leadTimeDays: payload.leadTimeDays,
      unitCost: payload.unitCost,
      criticalityLevel: payload.criticalityLevel,
    });

    if (!updated) {
      throw new NotFoundException('Peca nao encontrada');
    }

    return updated;
  }

  async getRestockPriorities(): Promise<RestockPrioritiesResponseDto> {
    const parts = await this.repository.findPotentialRestock();
    const priorities = this.priorityService.calculate(parts);

    return { priorities };
  }
}
