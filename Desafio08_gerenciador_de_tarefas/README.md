# Gerenciador de Tarefas - Full-Stack - Rocketseat

Uma API REST completa para gerenciamento de tarefas, desenvolvida como desafio do curso Full-Stack da Rocketseat. O projeto permite criar, organizar e rastrear tarefas em times com autenticação segura e histórico de alterações.

## ✨ Funcionalidades

- 👤 **Autenticação e Autorização**: Login seguro com JWT e controle de acesso baseado em papéis (Admin/Member)
- 👥 **Gerenciamento de Times**: Criar times e gerenciar membros
- ✅ **Gerenciamento de Tarefas**: Criar, atualizar e acompanhar tarefas com status e prioridades
- 📊 **Histórico de Alterações**: Rastreamento completo de mudanças de status das tarefas
- 🔐 **Autenticação com JWT**: Tokens seguros para comunicação entre cliente e servidor
- 🛡️ **Validação de Dados**: Validação com Zod para garantir integridade dos dados
- 🗄️ **Banco de Dados**: PostgreSQL com Prisma ORM

## 🛠️ Tecnologias Utilizadas

### Back-end

- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT (jsonwebtoken)** - Autenticação
- **Bcrypt** - Hashing de senhas
- **Zod** - Validação de schemas
- **Vitest** - Testes unitários
- **Supertest** - Testes de API
- **Docker & Docker Compose** - Containerização

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose (para executar o banco de dados)
- PostgreSQL (ou use Docker)

## 🚀 Instalação e Setup

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd Desafio08_gerenciador_de_tarefas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Docker Compose

O projeto inclui um arquivo `docker-compose.yml` para iniciar o PostgreSQL:

```bash
docker-compose up -d
```

Isso iniciará um container PostgreSQL na porta `5432`.

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/task_manager"

# JWT
JWT_SECRET="sua_chave_secreta_aqui"

# Ambiente
NODE_ENV="development"

# Porta da aplicação
PORT=3000
```

### 5. Execute as migrations do Prisma

```bash
npx prisma migrate dev --name init
```

Isso criará as tabelas no banco de dados.

## 📖 Como Usar

### Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3000`

### Executar testes

```bash
npm test
```

Para executar testes em modo watch:

```bash
npm test -- --watch
```

### Abrir Prisma Studio

Para visualizar e gerenciar os dados do banco de dados:

```bash
npx prisma studio
```

## 📂 Estrutura do Projeto

```
src/
├── app.ts                      # Configuração do Express
├── server.ts                   # Inicialização do servidor
├── env.ts                      # Validação de variáveis de ambiente
├── configs/
│   └── auth.ts                 # Configuração de autenticação (JWT)
├── controllers/
│   ├── users-controller.ts     # Lógica de usuários
│   ├── sessions-controller.ts  # Lógica de sessões/login
│   ├── teams-controller.ts     # Lógica de times
│   ├── members-controller.ts   # Lógica de membros de times
│   ├── task-controller.ts      # Lógica de tarefas
│   └── history-controller.ts   # Lógica de histórico
├── routes/
│   ├── index.ts                # Rotas principais
│   ├── users-routes.ts         # Rotas de usuários
│   ├── sessions-routes.ts      # Rotas de sessões
│   ├── teams-routes.ts         # Rotas de times
│   ├── members-routes.ts       # Rotas de membros
│   └── task-routes.ts          # Rotas de tarefas
├── middlewares/
│   ├── ensure-authenticated.ts # Middleware de autenticação
│   ├── verify-user-authorization.ts # Middleware de autorização
│   └── error-handling.ts       # Tratamento de erros
├── database/
│   └── prisma.ts               # Cliente Prisma
├── types/
│   └── express.d.ts            # Types customizados do Express
└── utils/
    └── AppError.ts             # Classe de erro customizada
```

## 🔌 Endpoints da API

### Autenticação

- `POST /sessions` - Login de usuário

### Usuários

- `POST /users` - Criar novo usuário
- `GET /users` - Listar todos os usuários (requer autenticação)

### Times

- `POST /teams` - Criar novo time (requer autenticação)
- `GET /teams` - Listar todos os times (requer autenticação)
- `GET /teams/:id` - Obter detalhes de um time específico

### Membros de Times

- `POST /members` - Adicionar membro ao time (requer autenticação)
- `GET /members/:teamId` - Listar membros de um time

### Tarefas

- `POST /tasks` - Criar nova tarefa (requer autenticação)
- `GET /tasks` - Listar tarefas (requer autenticação)
- `GET /tasks/:id` - Obter detalhes de uma tarefa
- `PUT /tasks/:id` - Atualizar tarefa (requer autenticação)
- `DELETE /tasks/:id` - Deletar tarefa (requer autenticação)

## 🗄️ Modelo de Dados

### Users

- `id` - UUID único do usuário
- `name` - Nome do usuário (único)
- `email` - Email do usuário (único)
- `password` - Senha criptografada com bcrypt
- `role` - Papel do usuário (member/admin)
- `createdAt` - Data de criação
- `updatedAt` - Data da última atualização

### Teams

- `id` - UUID único do time
- `name` - Nome do time (único)
- `description` - Descrição do time
- `createdAt` - Data de criação
- `updatedAt` - Data da última atualização

### Tasks

- `id` - UUID único da tarefa
- `title` - Título da tarefa
- `description` - Descrição detalhada
- `status` - Status (pending/in_progress/completed)
- `priority` - Prioridade (high/medium/low)
- `assignedToId` - ID do usuário responsável
- `teamId` - ID do time
- `createdAt` - Data de criação
- `updatedAt` - Data da última atualização

### TasksHistory

- `id` - UUID único do registro
- `taskId` - ID da tarefa
- `changedById` - ID do usuário que fez a alteração
- `oldStatus` - Status anterior
- `newStatus` - Status novo
- `changedAt` - Data da alteração

## 🧪 Testes

O projeto inclui testes automatizados com Vitest e Supertest. Os testes cobrem:

- ✅ Autenticação de usuários
- ✅ Gerenciamento de times e membros
- ✅ Operações com tarefas
- ✅ Validação de dados

## 🔒 Segurança

- Senhas são criptografadas com bcrypt
- Autenticação por JWT (JSON Web Tokens)
- Validação de entrada com Zod
- Middleware de autorização por papel
- Tratamento centralizado de erros
