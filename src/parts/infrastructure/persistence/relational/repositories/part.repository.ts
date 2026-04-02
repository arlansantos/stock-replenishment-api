import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Part } from '../../../../domain/part';
import { FindPartsDto } from '../../../../dto/find-parts.dto';
import { PartAbstractRepository } from '../../../../part.abstract.repository';
import { Repository } from 'typeorm';
import { PartEntity } from '../entities/part.entity';
import { PartMapper } from '../mappers/part.mapper';

@Injectable()
export class PartRelationalRepository implements PartAbstractRepository {
  constructor(
    @InjectRepository(PartEntity)
    private readonly repository: Repository<PartEntity>,
  ) {}

  async create(part: Part): Promise<Part> {
    const entity = this.repository.create(PartMapper.toPersistence(part));
    const saved = await this.repository.save(entity);

    return PartMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Part | null> {
    const entity = await this.repository.findOne({ where: { id } });

    return entity ? PartMapper.toDomain(entity) : null;
  }

  async findPotentialRestock(): Promise<Part[]> {
    const entities = await this.repository
      .createQueryBuilder('part')
      .where(
        'part.currentStock - (part.averageDailySales * part.leadTimeDays) < part.minimumStock',
      )
      .getMany();

    return entities.map(PartMapper.toDomain);
  }

  async findAllWithPagination(query: FindPartsDto): Promise<[Part[], number]> {
    const {
      page,
      limit,
      orderBy,
      orderDirection,
      category,
      criticalityLevel,
      needsRestock,
    } = query;

    const qb = this.repository
      .createQueryBuilder('part')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(
        `part.${orderBy || 'created_at'}`,
        (orderDirection || 'DESC').toUpperCase() as 'ASC' | 'DESC',
      );

    if (category) {
      qb.andWhere('part.category = :category', { category });
    }

    if (criticalityLevel) {
      qb.andWhere('part.criticality_level = :criticalityLevel', {
        criticalityLevel,
      });
    }

    if (needsRestock === true) {
      qb.andWhere(
        'part.current_stock - (part.average_daily_sales * part.lead_time_days) < part.minimum_stock',
      );
    }

    if (needsRestock === false) {
      qb.andWhere(
        'part.current_stock - (part.average_daily_sales * part.lead_time_days) >= part.minimum_stock',
      );
    }

    const [entities, total] = await qb.getManyAndCount();

    return [entities.map(PartMapper.toDomain), total];
  }

  async update(id: string, payload: Partial<Part>): Promise<Part | null> {
    const current = await this.repository.findOne({ where: { id } });

    if (!current) {
      return null;
    }

    const merged = this.repository.merge(current, {
      name: payload.name,
      category: payload.category,
      currentStock: payload.currentStock,
      minimumStock: payload.minimumStock,
      averageDailySales: payload.averageDailySales,
      leadTimeDays: payload.leadTimeDays,
      unitCost: payload.unitCost,
      criticalityLevel: payload.criticalityLevel,
    });

    const saved = await this.repository.save(merged);

    return PartMapper.toDomain(saved);
  }
}
