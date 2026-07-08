# API de Ticket de Suporte - Full-Stack - Rocketseat

API REST simples para gerenciar tickets de suporte (criação, listagem, atualização, fechamento e remoção). Projeto feito em Node.js durante um curso da Rocketseat.

## Tecnologias

- Node.js (ES Modules)
- API HTTP com módulos nativos

## Estrutura principal

- `src/server.js` — servidor HTTP e porta padrão `3333`
- `src/routes/tickets.js` — definição das rotas de tickets
- `src/controllers/tickets/*` — implementações das ações (create, index, update, updateStatus, remove)
- `database/db.json` — armazenamento simples em JSON (via `database/database.js`)

## Requisitos

- Node.js 18+ (recomendado, para `node --watch` usado no `npm run dev`)

## Instalação

1. Instale dependências:

```
npm install
```

2. Execute em modo desenvolvimento:

```
npm run dev
```

Ou execute diretamente:

```
node src/server.js
```

O servidor roda em `http://localhost:3333`.

## Endpoints

- POST /tickets
  - Cria um novo ticket.
  - Body JSON: `{ "equipment": "...", "description": "...", "user_name": "..." }`
  - Retorna: `201` com o ticket criado.

- GET /tickets
  - Lista todos os tickets.
  - Query opcional: `?status=open` ou `?status=closed` para filtrar por status.

- PUT /tickets/:id
  - Atualiza os campos `equipment` e `description` do ticket.
  - Body JSON: `{ "equipment": "...", "description": "..." }`

- PATCH /tickets/:id/close
  - Fecha o ticket e registra a solução.
  - Body JSON: `{ "solution": "Descrição da solução" }`

- DELETE /tickets/:id
  - Remove o ticket.

## Exemplos (curl)

- Criar ticket:

```
curl -X POST http://localhost:3333/tickets \
	-H "Content-Type: application/json" \
	-d '{"equipment":"Notebook","description":"Não liga","user_name":"João"}'
```

- Listar tickets abertos:

```
curl http://localhost:3333/tickets?status=open
```

- Fechar ticket:

```
curl -X PATCH http://localhost:3333/tickets/<ID>/close \
	-H "Content-Type: application/json" \
	-d '{"solution":"Troquei a fonte"}'
```

Substitua `<ID>` pelo `id` do ticket desejado.

## Observações

- Armazenamento simples em `database/db.json` (próprio para aprendizagem). Para produção, substitua por um banco de dados real.
- Projeto desenvolvido como parte de um curso da Rocketseat.

## Autor

Jackson Gravino
