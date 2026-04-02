import { CriticalityLevelEnum } from '../../enums/criticality-level.enum';
import { Part } from '../part';
import { PriorityService } from './priority.service';

const createPart = (data: Partial<Part>): Part =>
  Object.assign(new Part(), data);

describe('PriorityService', () => {
  let service: PriorityService;

  beforeEach(() => {
    service = new PriorityService();
  });

  it('should filter out parts that do not need restock', () => {
    const prioritized = service.calculate([
      createPart({
        id: '1',
        name: 'Parafuso',
        currentStock: 100,
        minimumStock: 10,
        averageDailySales: 1,
        leadTimeDays: 1,
        criticalityLevel: CriticalityLevelEnum.LOW,
      }),
      createPart({
        id: '2',
        name: 'Filtro',
        currentStock: 10,
        minimumStock: 20,
        averageDailySales: 4,
        leadTimeDays: 5,
        criticalityLevel: CriticalityLevelEnum.MEDIUM,
      }),
    ]);

    expect(prioritized).toHaveLength(1);
    expect(prioritized[0]).toMatchObject({
      partId: '2',
      name: 'Filtro',
      currentStock: 10,
      projectedStock: -10,
      minimumStock: 20,
      urgencyScore: 90,
      criticalityLevel: CriticalityLevelEnum.MEDIUM,
      averageDailySales: 4,
    });
  });

  it('should sort by urgency score, then criticality, then average daily sales, then name', () => {
    const prioritized = service.calculate([
      createPart({
        id: 'a',
        name: 'Amortecedor',
        currentStock: 12,
        minimumStock: 20,
        averageDailySales: 4,
        leadTimeDays: 5,
        criticalityLevel: CriticalityLevelEnum.LOW,
      }),
      createPart({
        id: 'b',
        name: 'Bateria',
        currentStock: 12,
        minimumStock: 20,
        averageDailySales: 4,
        leadTimeDays: 5,
        criticalityLevel: CriticalityLevelEnum.LOW,
      }),
      createPart({
        id: 'c',
        name: 'Carcaça',
        currentStock: 16,
        minimumStock: 20,
        averageDailySales: 2,
        leadTimeDays: 5,
        criticalityLevel: CriticalityLevelEnum.HIGH,
      }),
      createPart({
        id: 'd',
        name: 'Detector',
        currentStock: 2,
        minimumStock: 20,
        averageDailySales: 2,
        leadTimeDays: 5,
        criticalityLevel: CriticalityLevelEnum.LOW,
      }),
    ]);

    expect(prioritized.map((item) => item.partId)).toEqual([
      'c',
      'a',
      'b',
      'd',
    ]);
  });
});
