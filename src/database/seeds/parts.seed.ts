import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CriticalityLevelEnum } from '../../parts/enums/criticality-level.enum';

const seedParts = async (dataSource: DataSource): Promise<void> => {
  const partsData = [
    {
      id: uuidv4(),
      name: 'Filtro de Oleo X',
      category: 'engine',
      currentStock: 15,
      minimumStock: 20,
      averageDailySales: 4,
      leadTimeDays: 5,
      unitCost: 18.5,
      criticalityLevel: CriticalityLevelEnum.MEDIUM,
    },
    {
      id: uuidv4(),
      name: 'Pastilha de Freio Y',
      category: 'brake',
      currentStock: 8,
      minimumStock: 10,
      averageDailySales: 2.5,
      leadTimeDays: 7,
      unitCost: 45.0,
      criticalityLevel: CriticalityLevelEnum.HIGH,
    },
    {
      id: uuidv4(),
      name: 'Correia Serpentina Z',
      category: 'engine',
      currentStock: 25,
      minimumStock: 15,
      averageDailySales: 1.2,
      leadTimeDays: 10,
      unitCost: 65.0,
      criticalityLevel: CriticalityLevelEnum.CRITICAL,
    },
    {
      id: uuidv4(),
      name: 'Bateria 12V Plus',
      category: 'electrical',
      currentStock: 5,
      minimumStock: 8,
      averageDailySales: 0.8,
      leadTimeDays: 3,
      unitCost: 250.0,
      criticalityLevel: CriticalityLevelEnum.CRITICAL,
    },
    {
      id: uuidv4(),
      name: 'Jogo de Velas Standard',
      category: 'engine',
      currentStock: 30,
      minimumStock: 25,
      averageDailySales: 3.5,
      leadTimeDays: 4,
      unitCost: 28.5,
      criticalityLevel: CriticalityLevelEnum.MEDIUM,
    },
    {
      id: uuidv4(),
      name: 'Amortecedor Dianteiro',
      category: 'suspension',
      currentStock: 2,
      minimumStock: 5,
      averageDailySales: 1.5,
      leadTimeDays: 14,
      unitCost: 150.0,
      criticalityLevel: CriticalityLevelEnum.HIGH,
    },
    {
      id: uuidv4(),
      name: 'Sensor O2 Universal',
      category: 'emissions',
      currentStock: 12,
      minimumStock: 8,
      averageDailySales: 0.5,
      leadTimeDays: 6,
      unitCost: 85.0,
      criticalityLevel: CriticalityLevelEnum.LOW,
    },
    {
      id: uuidv4(),
      name: 'Disco de Freio Premium',
      category: 'brake',
      currentStock: 3,
      minimumStock: 6,
      averageDailySales: 2.0,
      leadTimeDays: 8,
      unitCost: 120.0,
      criticalityLevel: CriticalityLevelEnum.HIGH,
    },
  ];

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const part of partsData) {
      await queryRunner.query(
        `INSERT INTO parts (id, name, category, current_stock, minimum_stock, average_daily_sales, lead_time_days, unit_cost, criticality_level, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [
          part.id,
          part.name,
          part.category,
          part.currentStock,
          part.minimumStock,
          part.averageDailySales,
          part.leadTimeDays,
          part.unitCost,
          part.criticalityLevel,
        ],
      );
    }
    await queryRunner.commitTransaction();
    console.log(`✓ Seeded ${partsData.length} parts successfully`);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export default seedParts;
