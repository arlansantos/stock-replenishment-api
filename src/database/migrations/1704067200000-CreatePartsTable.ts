import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePartsTable1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'parts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'current_stock',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'minimum_stock',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'average_daily_sales',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'lead_time_days',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'unit_cost',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'criticality_level',
            type: 'smallint',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'parts',
      new TableIndex({
        name: 'IDX_PARTS_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'parts',
      new TableIndex({
        name: 'IDX_PARTS_CATEGORY',
        columnNames: ['category'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('parts', 'IDX_PARTS_CATEGORY');
    await queryRunner.dropIndex('parts', 'IDX_PARTS_NAME');
    await queryRunner.dropTable('parts', true);
  }
}
