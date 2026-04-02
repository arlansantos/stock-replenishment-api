import { CriticalityLevelEnum } from '../enums/criticality-level.enum';
import { Part } from './part';

describe('Part', () => {
  describe('create', () => {
    it('should build a part from the provided payload', () => {
      const part = Part.create({
        name: 'Filtro de Oleo X',
        category: 'engine',
        currentStock: 15,
        minimumStock: 20,
        averageDailySales: 4,
        leadTimeDays: 5,
        unitCost: 18.5,
        criticalityLevel: CriticalityLevelEnum.MEDIUM,
      });

      expect(part).toMatchObject({
        name: 'Filtro de Oleo X',
        category: 'engine',
        currentStock: 15,
        minimumStock: 20,
        averageDailySales: 4,
        leadTimeDays: 5,
        unitCost: 18.5,
        criticalityLevel: CriticalityLevelEnum.MEDIUM,
      });
      expect(part.id).toBeUndefined();
      expect(part.createdAt).toBeUndefined();
      expect(part.updatedAt).toBeUndefined();
    });
  });

  describe('calculateExpectedConsumption', () => {
    it('should multiply average daily sales by lead time days', () => {
      const part = Object.assign(new Part(), {
        averageDailySales: 4,
        leadTimeDays: 5,
      });

      expect(part.calculateExpectedConsumption()).toBe(20);
    });
  });

  describe('calculateProjectedStock', () => {
    it('should subtract the expected consumption from current stock', () => {
      const part = Object.assign(new Part(), {
        currentStock: 15,
        averageDailySales: 4,
        leadTimeDays: 5,
      });

      expect(part.calculateProjectedStock()).toBe(-5);
    });
  });

  describe('needsRestock', () => {
    it('should return true when projected stock is below minimum stock', () => {
      const part = Object.assign(new Part(), {
        currentStock: 15,
        minimumStock: 20,
        averageDailySales: 4,
        leadTimeDays: 5,
      });

      expect(part.needsRestock()).toBe(true);
    });

    it('should return false when projected stock reaches minimum stock', () => {
      const part = Object.assign(new Part(), {
        currentStock: 30,
        minimumStock: 10,
        averageDailySales: 2,
        leadTimeDays: 10,
      });

      expect(part.needsRestock()).toBe(false);
    });
  });

  describe('calculateUrgencyScore', () => {
    it('should calculate the urgency using minimum stock, projected stock and criticality level', () => {
      const part = Object.assign(new Part(), {
        currentStock: 15,
        minimumStock: 20,
        averageDailySales: 4,
        leadTimeDays: 5,
        criticalityLevel: CriticalityLevelEnum.MEDIUM,
      });

      expect(part.calculateUrgencyScore()).toBe(75);
    });
  });
});
