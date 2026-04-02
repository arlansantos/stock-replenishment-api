import { NotFoundException } from '@nestjs/common';
import { PaginationResponseDto } from '../utils/pagination/pagination-response.dto';
import { OrderDirection } from '../utils/enums/order-direction.enum';
import { CriticalityLevelEnum } from './enums/criticality-level.enum';
import { Part } from './domain/part';
import { PriorityService } from './domain/services/priority.service';
import { PartsService } from './parts.service';
import { PartAbstractRepository } from './part.abstract.repository';

const createPart = (data: Partial<Part>): Part =>
  Object.assign(new Part(), data);

describe('PartsService', () => {
  let service: PartsService;
  let repository: jest.Mocked<PartAbstractRepository>;
  let priorityService: jest.Mocked<PriorityService>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      findPotentialRestock: jest.fn(),
      findAllWithPagination: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<PartAbstractRepository>;

    priorityService = {
      calculate: jest.fn(),
    } as jest.Mocked<PriorityService>;

    service = new PartsService(repository, priorityService);
  });

  it('should create a part through the repository', async () => {
    const payload = {
      name: 'Filtro de Oleo X',
      category: 'engine',
      currentStock: 15,
      minimumStock: 20,
      averageDailySales: 4,
      leadTimeDays: 5,
      unitCost: 18.5,
      criticalityLevel: CriticalityLevelEnum.MEDIUM,
    };
    const created = createPart({ id: 'part-1', ...payload });

    repository.create.mockResolvedValue(created);

    await expect(service.create(payload)).resolves.toBe(created);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining(payload),
    );
  });

  it('should return a paginated response with repository data', async () => {
    const query = {
      page: 2,
      limit: 5,
      orderBy: 'name',
      orderDirection: OrderDirection.ASC,
      category: 'engine',
      criticalityLevel: CriticalityLevelEnum.HIGH,
      needsRestock: true,
    };
    const parts = [createPart({ id: 'part-1', name: 'Filtro' })];

    repository.findAllWithPagination.mockResolvedValue([parts, 11]);

    const result = await service.findAll(query);

    expect(repository.findAllWithPagination).toHaveBeenCalledWith(query);
    expect(result).toBeInstanceOf(PaginationResponseDto);
    expect(result.data).toBe(parts);
    expect(result.meta).toMatchObject({
      itemCount: 1,
      totalItems: 11,
      itemsPerPage: 5,
      currentPage: 2,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: true,
    });
  });

  it('should return a part when it exists', async () => {
    const part = createPart({ id: 'part-1', name: 'Filtro' });

    repository.findById.mockResolvedValue(part);

    await expect(service.findOne('part-1')).resolves.toBe(part);
    expect(repository.findById).toHaveBeenCalledWith('part-1');
  });

  it('should throw when the part does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(service.findOne('missing')).rejects.toThrow(
      'Peca nao encontrada',
    );
  });

  it('should update a part and map only supported fields', async () => {
    const payload = {
      name: 'Filtro novo',
      category: 'engine',
      currentStock: 20,
      minimumStock: 25,
      averageDailySales: 5,
      leadTimeDays: 4,
      unitCost: 21.9,
      criticalityLevel: CriticalityLevelEnum.HIGH,
    };
    const updated = createPart({ id: 'part-1', ...payload });

    repository.update.mockResolvedValue(updated);

    await expect(service.update('part-1', payload)).resolves.toBe(updated);
    expect(repository.update).toHaveBeenCalledWith('part-1', payload);
  });

  it('should throw when update does not find the part', async () => {
    repository.update.mockResolvedValue(null);

    await expect(
      service.update('missing', {
        name: 'Filtro novo',
      } as never),
    ).rejects.toThrow('Peca nao encontrada');
  });

  it('should calculate restock priorities using the priority service', async () => {
    const parts = [createPart({ id: 'part-1', name: 'Filtro' })];
    const priorities = [
      {
        partId: 'part-1',
        name: 'Filtro',
        currentStock: 10,
        projectedStock: -10,
        minimumStock: 20,
        urgencyScore: 90,
        criticalityLevel: CriticalityLevelEnum.MEDIUM,
        averageDailySales: 4,
      },
    ];

    repository.findPotentialRestock.mockResolvedValue(parts);
    priorityService.calculate.mockReturnValue(priorities);

    await expect(service.getRestockPriorities()).resolves.toEqual({
      priorities,
    });
    expect(repository.findPotentialRestock).toHaveBeenCalledTimes(1);
    expect(priorityService.calculate).toHaveBeenCalledWith(parts);
  });
});
