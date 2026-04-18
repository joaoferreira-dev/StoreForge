# Copilot Instructions

## Build, test e lint

- Instalar dependências: `npm install`
- Rodar ambiente local: `npm run dev`
- Build de produção: `npm run build`
- Rodar produção local: `npm run start`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Testes completos: `npm run test`
- Teste único (exemplo real): `npm run test:single`
- Gerar cliente Prisma: `npm run db:generate`
- Rodar migrações locais: `npm run db:migrate`
- Popular banco com seed: `npm run db:seed`

## Arquitetura (visão geral)

- O projeto é um **single-repo Next.js** com App Router.
- A camada web e backend inicial convivem no mesmo app (`src/app`), alinhado ao plano MVP.
- Configurações compartilhadas e helpers ficam em `src/lib`.
- Testes automatizados ficam em `src/tests`, com Vitest.
- O plano funcional e roadmap do produto está em `docs/initial_plan.md`.

## Convenções deste repositório

- Linguagem padrão: **TypeScript estrito**.
- Imports internos devem usar alias `@/` para arquivos em `src`.
- Variáveis de ambiente obrigatórias devem ser acessadas por helpers em `src/lib/config/env.ts` (evitar `process.env` espalhado).
- A base visual usa Tailwind; componentes e páginas devem manter estilo minimalista claro com alto contraste.
- Todo novo código implementado deve incluir testes unitários correspondentes em `src/tests`.
- No início de cada pacote de alterações, criar uma nova branch de trabalho antes de implementar mudanças.
- Commit e push devem ser feitos somente no final, após 100% das finalizações e ajustes concluídos, sempre na branch criada para aquele pacote.
- Mudanças de fase do roadmap devem atualizar este arquivo em uma seção de status.
- Encerramento obrigatório de fase: executar `npm run phase:close` e, em seguida, criar branch de trabalho, realizar commit e push para abertura automática de PR para `master`.

## Status de execução do roadmap

- **Fase 1 (Fundação): concluída**
  - Setup base do projeto com Next.js + TypeScript + Tailwind.
  - Scripts de lint/typecheck/test/build definidos.
  - CI inicial em `.github/workflows/ci.yml`.
  - Padrão de variáveis de ambiente com `.env.example` e helper central.
- **Fase 2 (Núcleo de domínio): concluída**
  - Modelagem Prisma implementada para usuários, catálogo, carrinho, pedidos, pagamentos e endereços.
  - Scripts de banco adicionados (`db:generate`, `db:migrate`, `db:seed`).
  - Seed idempotente de categorias e produtos mockados criado em `prisma/seed.mjs`.
- **Fase 3 (Experiência de compra): concluída**
  - Home com vitrine dinâmica, busca e atalhos de categoria implementada.
  - PLP com filtros por categoria, busca textual e ordenação por preço.
  - PDP implementada com detalhes de produto e adição ao carrinho.
  - Carrinho persistente por sessão e checkout como convidado com criação de pedido.
- **Fase 4 (Operação / admin-backoffice): concluída**
  - Painel operacional em `/admin` com acompanhamento de pedidos.
  - CRUD de categorias implementado em `/admin/categorias`.
  - CRUD de produtos implementado em `/admin/produtos` com associação de categorias.
  - Controle de status de pedidos disponível para operação.
