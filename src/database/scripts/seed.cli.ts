import 'dotenv/config';
import { Command } from 'commander';
import { DataSource } from 'typeorm';
import { CreatePartsTable1704067200000 } from '../migrations/1704067200000-CreatePartsTable';
import seedParts from '../seeds/parts.seed';

const validateEnv = (): void => {
  const requiredEnvs = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
  ];
  const missing = requiredEnvs.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:', missing.join(', '));
    console.error('Verifique o arquivo .env');
    process.exit(1);
  }
};

const createDataSource = (): DataSource => {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    migrations: [CreatePartsTable1704067200000],
    synchronize: false,
    logging: false,
  });
};

const program = new Command();

program
  .command('db:migrate')
  .description('Executar migrations do banco de dados')
  .action(async () => {
    validateEnv();

    let dataSource: DataSource | null = null;
    try {
      console.log('⚙️  Inicializando datasource...');
      dataSource = createDataSource();

      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      console.log('📦 Executando migrations...');
      await dataSource.runMigrations();
      console.log('✓ Migrations executadas com sucesso');

      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(0);
    } catch (error) {
      console.error('✗ Erro ao executar migrations:', error);
      if (dataSource?.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(1);
    }
  });

program
  .command('db:populate')
  .description('Popular banco de dados com seeds')
  .action(async () => {
    validateEnv();

    let dataSource: DataSource | null = null;
    try {
      console.log('⚙️  Inicializando datasource...');
      dataSource = createDataSource();

      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      console.log('🌱 Executando seeds...');
      await seedParts(dataSource);
      console.log('✓ Seeds executadas com sucesso');

      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(0);
    } catch (error) {
      console.error('✗ Erro ao executar seeds:', error);
      if (dataSource?.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(1);
    }
  });

program
  .command('db:seed')
  .description('Executar migrations e seeds do banco de dados')
  .action(async () => {
    validateEnv();

    let dataSource: DataSource | null = null;
    try {
      console.log('⚙️  Inicializando datasource...');
      dataSource = createDataSource();

      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      console.log('📦 Executando migrations...');
      await dataSource.runMigrations();
      console.log('✓ Migrations executadas com sucesso');

      console.log('🌱 Executando seeds...');
      await seedParts(dataSource);
      console.log('✓ Seeds executadas com sucesso');

      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
      console.log('✓ Banco de dados atualizado com sucesso!');
      process.exit(0);
    } catch (error) {
      console.error('✗ Erro ao executar migrations/seeds:', error);
      if (dataSource?.isInitialized) {
        await dataSource.destroy();
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
