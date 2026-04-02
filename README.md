# API de Priorizacao de Reposicao de Estoque

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-E83524?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

Microservico backend desenvolvido em NestJS para gerenciar autopecas em estoque e calcular, de forma automatica, a prioridade de reposicao.

## Contexto do Desafio

Em um distribuidor de autopecas, e necessario decidir diariamente quais itens devem ser repostos primeiro, considerando:

- Estoque limitado
- Capital de giro limitado
- Diferentes niveis de criticidade
- Padroes de venda distintos
- Tempo de reposicao de fornecedor

Este projeto resolve o problema com um motor de priorizacao baseado em regras de negocio objetivas.

## Objetivos

1. Gerenciar pecas em estoque (CRUD parcial implementado)
2. Calcular automaticamente prioridade de reposicao
3. Ordenar pecas por urgencia

## Tecnologias Utilizadas

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Class Validator + Class Transformer
- Swagger (OpenAPI)
- Jest (testes unitarios e cobertura)
- Docker e Docker Compose
- ESLint + Prettier + EditorConfig + Husky

## Regras de Negocio

1. Consumo esperado durante o lead time

```txt
expectedConsumption = averageDailySales * leadTimeDays
```

2. Estoque projetado

```txt
projectedStock = currentStock - expectedConsumption
```

3. Necessidade de reposicao

```txt
needsRestock quando projectedStock < minimumStock
```

4. Score de urgencia

```txt
urgencyScore = (minimumStock - projectedStock) * criticalityLevel
```

Quanto maior o `urgencyScore`, maior a prioridade.

### Criterios de Desempate

1. Maior `criticalityLevel`
2. Maior `averageDailySales`
3. Ordem alfabetica por `name`

## Estrutura da Entidade

```json
{
  "id": "uuid",
  "name": "Filtro de Oleo X",
  "category": "engine",
  "currentStock": 15,
  "minimumStock": 20,
  "averageDailySales": 4,
  "leadTimeDays": 5,
  "unitCost": 18.5,
  "criticalityLevel": 3
}
```

## Endpoints Disponiveis

Prefixo global da API: `/api`

| Metodo  | Rota                      | Descricao                           |
| :------ | :------------------------ | :---------------------------------- |
| `POST`  | `/api/parts`              | Cria uma peca                       |
| `GET`   | `/api/parts`              | Lista pecas com paginacao e filtros |
| `GET`   | `/api/parts/:id`          | Busca peca por ID                   |
| `PATCH` | `/api/parts/:id`          | Atualiza uma peca                   |
| `GET`   | `/api/restock/priorities` | Lista prioridades de reposicao      |

## Filtros de Listagem

Na rota `GET /api/parts`, e possivel usar:

- `page` (default: 1)
- `limit` (default: 10)
- `orderBy`
- `orderDirection` (`ASC` ou `DESC`)
- `category`
- `criticalityLevel`
- `needsRestock` (`true` ou `false`)

## Como Rodar o Projeto

### Pre-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar ambiente

Crie ou ajuste o arquivo `.env` (ja existe `.env.example` como referencia):

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=stock_replenishment
```

### 3. Subir banco com Docker

```bash
docker-compose up -d postgres
```

### 4. Criar estrutura e dados iniciais

```bash
npm run db:seed
```

### 5. Subir API em desenvolvimento

```bash
npm run start:dev
```

API: `http://localhost:3000/api`

Swagger: `http://localhost:3000/docs`

## Execucao 100% via Docker

Se preferir subir API + banco em containers:

```bash
docker-compose up -d --build
```

## Scripts Uteis

```bash
# build
npm run build

# start
npm run start
npm run start:dev
npm run start:prod

# banco
npm run db:migrate
npm run db:populate
npm run db:seed
```

## Testes

```bash
# testes unitarios
npm test

# modo watch
npm run test:watch

# cobertura
npm run test:cov
```
