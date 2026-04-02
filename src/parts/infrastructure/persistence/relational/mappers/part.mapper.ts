import { Part } from '../../../../domain/part';
import { PartEntity } from '../entities/part.entity';

export class PartMapper {
  static toDomain(raw: PartEntity): Part {
    const part = new Part();
    part.id = raw.id;
    part.name = raw.name;
    part.category = raw.category;
    part.currentStock = raw.currentStock;
    part.minimumStock = raw.minimumStock;
    part.averageDailySales = Number(raw.averageDailySales);
    part.leadTimeDays = raw.leadTimeDays;
    part.unitCost = Number(raw.unitCost);
    part.criticalityLevel = raw.criticalityLevel;
    part.createdAt = raw.createdAt;
    part.updatedAt = raw.updatedAt;

    return part;
  }

  static toPersistence(part: Part): PartEntity {
    const entity = new PartEntity();
    entity.id = part.id;
    entity.name = part.name;
    entity.category = part.category;
    entity.currentStock = part.currentStock;
    entity.minimumStock = part.minimumStock;
    entity.averageDailySales = part.averageDailySales;
    entity.leadTimeDays = part.leadTimeDays;
    entity.unitCost = part.unitCost;
    entity.criticalityLevel = part.criticalityLevel;
    entity.createdAt = part.createdAt;
    entity.updatedAt = part.updatedAt;

    return entity;
  }
}
