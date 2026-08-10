# API Restaurant - Full-Stack - Rocketseat

Este repositório contém a API do projeto desenvolvido durante o curso Full-Stack da Rocketseat. É uma API simples para gerenciar produtos, mesas, sessões de mesa e pedidos de um restaurante.

## Funcionalidades

- Gerenciar produtos (criar, listar, remover)
- Gerenciar mesas (criar, listar)
- Criar/encerrar sessões de mesa
- Criar e listar pedidos vinculados a sessões/mesas

## Tecnologias

- Node.js
- TypeScript
- Knex (migrations e seeds)
- SQLite / Postgres (configurável via `knexfile.ts`)

## Pré-requisitos

- Node.js 16+ e npm
- Banco de dados suportado configurado (consulte `knexfile.ts`)

## Instalação

1. Instale dependências:

```
npm install
```

2. Configure variáveis de ambiente (opcional)

- Se você usar variáveis de ambiente, crie um arquivo `.env` ou ajuste `knexfile.ts` com as credenciais do banco.

3. Execute as migrations e seeds:

```
npx knex --knexfile knexfile.ts migrate:latest
npx knex --knexfile knexfile.ts seed:run
```

4. Inicie a aplicação (modo desenvolvimento):

```
npm run dev
```

Obs: verifique os scripts em `package.json` para o comando exato de desenvolvimento (`dev`/`start`).

## Estrutura principal

- `src/server.ts` — ponto de entrada
- `src/controllers` — controladores das rotas
- `src/database/knex.ts` — configuração do Knex
- `src/database/migrations` — migrations
- `src/database/seeds` — seeds

## Rotas principais

As rotas seguem os arquivos em `src/routes` e geralmente estão agrupadas por recurso:

- `GET /products` — listar produtos
- `POST /products` — criar produto
- `GET /orders` — listar pedidos
- `POST /orders` — criar pedido
- `GET /tables` — listar mesas
- `POST /tables` — criar mesa
- `POST /tables-sessions` — iniciar sessão de mesa
- `DELETE /tables-sessions/:id` — encerrar sessão (exemplo)

## Banco de dados

- As migrations estão em `src/database/migrations`.
- As seeds estão em `src/database/seeds`.
- Para recriar o banco, rode as migrations e seeds novamente ou limpe manualmente o arquivo/servidor do banco e reexecute os comandos de migration/seed.
