# Módulo Parts - Guia de Uso

## 📋 O que foi criado

### DTOs

- **`RestockPrioritiesResponseDto`** - DTO estruturado para a resposta do endpoint de prioridades
  - Localização: `src/parts/dto/restock-priorities-response.dto.ts`

### Database

#### Migration

- **`CreatePartsTable1704067200000`** - Migration para criar a tabela `parts`
  - Localização: `src/database/migrations/1704067200000-CreatePartsTable.ts`
  - Cria tabela com todos os campos necessários

#### Seeds

- **`seedParts`** - Script com 8 peças de exemplo para populate do banco
  - Localização: `src/database/seeds/parts.seed.ts`
  - Inclui exemplos de diferentes categorias e níveis de criticidade

#### CLI

- **`seed.cli.ts`** - Comandos para gerenciar migrations e seeds
  - Localização: `src/database/scripts/seed.cli.ts`
  - 3 comandos disponíveis: `db:migrate`, `db:populate`, `db:seed`

### Package.json

- 3 scripts adicionados:
  ```json
  "db:migrate": "ts-node -r tsconfig-paths/register src/database/scripts/seed.cli.ts db:migrate",
  "db:populate": "ts-node -r tsconfig-paths/register src/database/scripts/seed.cli.ts db:populate",
  "db:seed": "ts-node -r tsconfig-paths/register src/database/scripts/seed.cli.ts db:seed"
  ```

## 🚀 Como Usar

### 1. Executar Migrations (criar tabelas)

```bash
npm run db:migrate
```

Isso irá:

- ✅ Criar a tabela `parts` no banco

### 2. Executar Seeds (popular com dados)

```bash
npm run db:populate
```

Isso irá:

- ✅ Inserir 8 peças de exemplo no banco

### 3. Executar Ambos (Migrations + Seeds)

```bash
npm run db:seed
```

Isso irá:

- ✅ Criar a tabela `parts`
- ✅ Popular com 8 peças de exemplo

### 4. Endpoints Disponíveis

#### Listar Peças (com paginação)

```http
GET /api/parts?page=1&limit=10
```

#### Buscar Peça por ID

```http
GET /api/parts/{id}
```

#### Criar Peça

```http
POST /api/parts
Content-Type: application/json

{
  "id": "uuid",
  "name": "Nome da Peça",
  "category": "engine",
  "currentStock": 15,
  "minimumStock": 20,
  "averageDailySales": 4,
  "leadTimeDays": 5,
  "unitCost": 18.50,
  "criticalityLevel": 3
}
```

#### Atualizar Peça

```http
PATCH /api/parts/{id}
Content-Type: application/json

{
  "currentStock": 25,
  "minimumStock": 18
}
```

#### **Listar Prioridades de Reposição** ⭐

```http
GET /api/restock/priorities
```

Resposta:

```json
{
  "priorities": [
    {
      "partId": "uuid-1",
      "name": "Filtro de Óleo X",
      "currentStock": 15,
      "projectedStock": 5,
      "minimumStock": 20,
      "urgencyScore": 45
    }
  ]
}
```

## 📊 Dados de Exemplo (Seeds)

As 8 peças criadas pelo seed incluem:

1. **Filtro de Óleo X** - Engine, Medium criticality
2. **Pastilha de Freio Y** - Brake, High criticality
3. **Correia Serpentina Z** - Engine, Critical
4. **Bateria 12V Plus** - Electrical, Critical
5. **Jogo de Velas Standard** - Engine, Medium
6. **Amortecedor Dianteiro** - Suspension, High
7. **Sensor O2 Universal** - Emissions, Low
8. **Disco de Freio Premium** - Brake, High

## 🔧 Estrutura da Entity

```sql
CREATE TABLE parts (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(120) NOT NULL,
  current_stock INT NOT NULL,
  minimum_stock INT NOT NULL,
  average_daily_sales NUMERIC(12,2) NOT NULL,
  lead_time_days INT NOT NULL,
  unit_cost NUMERIC(12,2) NOT NULL,
  criticality_level SMALLINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 📝 Regras de Negócio

- **expectedConsumption** = averageDailySales × leadTimeDays
- **projectedStock** = currentStock - expectedConsumption
- **Necessidade de Reposição**: projectedStock < minimumStock
- **urgencyScore** = (minimumStock - projectedStock) × criticalityLevel

### Critérios de Desempate

1. Maior `urgencyScore`
2. Maior `criticalityLevel`
3. Maior `averageDailySales`
4. Ordem alfabética por nome
