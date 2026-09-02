# Refund 2.0

Aplicação full-stack para solicitação e gerenciamento de reembolsos, desenvolvida durante o curso Full-Stack da Rocketseat.

O sistema possui fluxos diferentes para colaboradores e gestores: colaboradores cadastram despesas com seus comprovantes, enquanto gestores consultam as solicitações registradas.

![Tela da aplicação](web/project.png)

## Funcionalidades

- Cadastro e autenticação de usuários
- Autenticação baseada em JWT
- Controle de acesso por perfil (`employee` e `manager`)
- Cadastro de solicitações de reembolso
- Seleção de categoria e valor da despesa
- Upload de comprovantes em JPEG e PNG
- Listagem de reembolsos para gestores
- Busca por nome do colaborador
- Paginação da listagem
- Visualização dos detalhes de uma solicitação
- Interface responsiva

## Tecnologias

### Front-end

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- Zod

### Back-end

- Node.js
- TypeScript
- Express
- Prisma
- SQLite
- JSON Web Token (JWT)
- bcrypt
- Multer
- Zod

## Estrutura do projeto

```text
.
├── api/    # API REST, autenticação, regras de acesso e persistência
└── web/    # Aplicação React e interface do usuário
```

## Pré-requisitos

- Node.js
- npm

## Como executar

Clone o repositório e instale as dependências de cada aplicação:

```bash
git clone <url-do-repositorio>
cd Projeto15_refund2_react

cd api
npm install
npx prisma migrate dev

cd ../web
npm install
```

Em um terminal, inicie a API:

```bash
cd api
npm run dev
```

A API estará disponível em `http://localhost:3333`.

Em outro terminal, inicie o front-end:

```bash
cd web
npm run dev
```

Acesse a URL exibida pelo Vite, normalmente `http://localhost:5173`.

O banco SQLite é criado em `api/prisma/dev.db` durante a execução das migrations. Os arquivos enviados são armazenados localmente em `api/tmp/uploads`.

## API

As rotas abaixo de `/refunds` e `/uploads` exigem o header:

```text
Authorization: Bearer <token>
```

| Método | Rota           | Acesso                | Descrição                                |
| ------ | -------------- | --------------------- | ---------------------------------------- |
| `POST` | `/users`       | Público               | Cadastra um usuário                      |
| `POST` | `/sessions`    | Público               | Autentica um usuário e retorna o token   |
| `POST` | `/uploads`     | Colaborador           | Envia um comprovante                     |
| `POST` | `/refunds`     | Colaborador           | Cria uma solicitação de reembolso        |
| `GET`  | `/refunds`     | Gestor                | Lista solicitações com busca e paginação |
| `GET`  | `/refunds/:id` | Colaborador ou gestor | Exibe uma solicitação específica         |

### Categorias de reembolso

As categorias aceitas pela API são:

`food`, `others`, `services`, `transport` e `accommodation`.

Os comprovantes aceitam imagens JPEG e PNG de até 1 MB.

## Scripts

### API

| Comando                  | Descrição                               |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Inicia a API em modo de desenvolvimento |
| `npx prisma migrate dev` | Cria ou atualiza o banco SQLite         |

### Web

| Comando           | Descrição                                    |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento do Vite |
| `npm run build`   | Verifica os tipos e gera a build de produção |
| `npm run preview` | Executa uma prévia da build de produção      |

## Aprendizados

Este projeto foi desenvolvido para praticar a construção de uma aplicação full-stack com React e Node.js, incluindo componentização, tipagem com TypeScript, roteamento, autenticação, autorização por perfil, validação de dados, upload de arquivos, integração com banco de dados e estilização responsiva.
