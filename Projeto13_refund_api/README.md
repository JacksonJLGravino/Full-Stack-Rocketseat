# Refund API - Full-Stack - Rocketseat

API de solicitação e acompanhamento de reembolsos, desenvolvida durante o curso Full-Stack da [Rocketseat](https://www.rocketseat.com.br/).

## Sobre o projeto

A aplicação permite:

- cadastrar usuários com os perfis `employee` ou `manager`;
- autenticar usuários com JWT;
- fazer upload de comprovantes de despesas;
- criar e consultar solicitações de reembolso;
- listar reembolsos com busca por nome e paginação.

## Tecnologias

- Node.js e TypeScript
- Express
- Prisma ORM
- SQLite
- JWT e bcrypt
- Zod
- Multer

## Pré-requisitos

- Node.js 18 ou superior
- npm

## Instalação e execução

Clone o repositório, entre na pasta do projeto e instale as dependências:

```bash
npm install
```

Crie o banco SQLite e execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

Inicie a API em modo de desenvolvimento:

```bash
npm run dev
```

O servidor ficará disponível em `http://localhost:3333`.

## Autenticação

As rotas protegidas utilizam um token JWT. Depois de fazer login, envie o token no cabeçalho das requisições:

```http
Authorization: Bearer SEU_TOKEN
```

O token possui validade de 1 dia. A chave utilizada atualmente está definida em `src/configs/auth.ts`.

## Rotas

### Usuários

#### `POST /users`

Cadastra um usuário. O perfil padrão é `employee`.

```json
{
  "name": "Nome",
  "email": "nome@example.com",
  "password": "123456",
  "role": "employee"
}
```

Os valores aceitos para `role` são `employee` e `manager`.

### Sessões

#### `POST /sessions`

Autentica um usuário e retorna o token JWT.

```json
{
  "email": "nome@example.com",
  "password": "123456"
}
```

### Uploads

#### `POST /uploads`

Rota protegida para usuários `employee`. Envie o comprovante como `multipart/form-data`, usando o campo `file`.

São aceitos arquivos `jpg`, `jpeg` e `png` de até 3 MB. A resposta contém o nome do arquivo salvo:

```json
{
  "filename": "nome-do-arquivo.png"
}
```

Os arquivos ficam disponíveis em `GET /uploads/:filename`.

### Reembolsos

#### `POST /refunds`

Rota protegida para usuários `employee`. Cria uma solicitação de reembolso.

```json
{
  "name": "Almoço com cliente",
  "category": "food",
  "amount": 89.9,
  "filename": "nome-do-comprovante.png"
}
```

Categorias aceitas: `food`, `others`, `services`, `transport` e `accommodation`.

O campo `filename` deve ser o nome retornado pela rota de upload.

#### `GET /refunds`

Rota protegida para usuários `manager`. Lista os reembolsos mais recentes primeiro.

Parâmetros de consulta opcionais:

| Parâmetro | Padrão | Descrição                          |
| --------- | -----: | ---------------------------------- |
| `name`    |   `""` | Filtra pelo nome do usuário        |
| `page`    |    `1` | Número da página                   |
| `perPage` |   `10` | Quantidade de registros por página |

Exemplo: `GET /refunds?name=Maria&page=1&perPage=10`

#### `GET /refunds/:id`

Rota protegida para usuários `employee` e `manager`. Consulta uma solicitação pelo UUID.

## Estrutura principal

```text
src/
├── configs/       # Configurações de autenticação e upload
├── controllers/   # Regras de entrada e saída das requisições
├── database/      # Cliente Prisma
├── middlewares/   # Autenticação, autorização e tratamento de erros
├── providers/     # Persistência de arquivos
├── routes/        # Rotas da API
└── utils/         # Utilitários e erros da aplicação
prisma/
└── schema.prisma  # Modelos User e Refunds
```

## Scripts

| Comando                  | Descrição                                   |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Inicia a API com recarregamento automático  |
| `npx prisma migrate dev` | Cria/atualiza o banco de desenvolvimento    |
| `npx prisma studio`      | Abre uma interface para visualizar os dados |

## Status

Projeto desenvolvido como prática do curso Full-Stack da Rocketseat.
