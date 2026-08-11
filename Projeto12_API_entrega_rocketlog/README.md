# Rocketlog API

API de gerenciamento de entregas criada no curso da Rocketseat.

## Descrição

Projeto backend em Node.js, TypeScript, Express e Prisma. A API permite:

- cadastro de usuários
- login e geração de JWT
- criação e listagem de entregas
- atualização de status de entregas
- registro e visualização de logs de entrega

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- JWT
- Zod
- bcrypt
- Jest + Supertest

## Estrutura de dados

- `User`
  - id, name, email, password, role
  - roles: `customer`, `sale`
- `Delivery`
  - id, user_id, description, status
  - status: `processing`, `shipped`, `delivered`
- `DeliveryLog`
  - id, delivery_id, description

## Instalação

1. Instale dependências

```bash
npm install
```

2. Crie o arquivo `.env` com as variáveis abaixo:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=uma_chave_secreta
```

3. Crie o banco de dados e aplique as migrations:

```bash
npx prisma migrate dev
```

4. Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor roda por padrão em `http://localhost:3333`.

## Scripts úteis

- `npm run dev` - inicia o servidor com `tsx` e recarregamento automático
- `npm run test:dev` - executa testes com Jest em watch mode

## Autenticação

A API usa JWT para rotas autenticadas.

- Login: `POST /sessions`
- Header de autorização: `Authorization: Bearer <token>`

## Endpoints

### Usuários

#### Criar usuário

- `POST /users`
- Body:
  - `name` (string)
  - `email` (string)
  - `password` (string)

Retorna o usuário criado sem a senha.

### Sessões

#### Login

- `POST /sessions`
- Body:
  - `email` (string)
  - `password` (string)

Retorna:

- `token`
- `user`

### Entregas

#### Criar entrega

- `POST /deliveries`
- Requer autenticação
- Requer role `sale`
- Body:
  - `user_id` (UUID do usuário destinatário)
  - `description` (string)

#### Listar entregas

- `GET /deliveries`
- Requer autenticação
- Requer role `sale`

#### Atualizar status de entrega

- `PATCH /deliveries/:id/status`
- Requer autenticação
- Requer role `sale`
- Body:
  - `status` (`processing` | `shipped` | `delivered`)

A cada atualização de status, um registro de log de entrega é criado.

### Logs de entrega

#### Criar log de entrega

- `POST /delivery-logs`
- Requer autenticação
- Requer role `sale`
- Body:
  - `delivery_id` (UUID)
  - `description` (string)

Condições de validação:

- entrega deve existir
- não pode criar log se a entrega já estiver `delivered`
- só pode criar log se a entrega estiver `shipped`

#### Exibir entrega e logs

- `GET /delivery-logs/:delivery_id/show`
- Requer autenticação
- Permite roles `sale` e `customer`
- Usuário `customer` só pode ver suas próprias entregas

## Observações

- A validação usa `zod` para dados de entrada.
- As senhas são armazenadas com hash usando `bcrypt`.
- O token JWT inclui a role do usuário e expira em 1 dia.

## Estrutura do projeto

- `src/app.ts` - configuração do Express
- `src/server.ts` - inicialização do servidor
- `src/routes` - definição de rotas
- `src/controllers` - lógica dos endpoints
- `src/middlewares` - autenticação e autorização
- `src/database/prisma.ts` - cliente Prisma
- `prisma/schema.prisma` - modelo de dados
