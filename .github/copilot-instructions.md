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
- Mudanças de fase do roadmap devem atualizar este arquivo em uma seção de status.
- Encerramento obrigatório de fase: executar `npm run phase:close` antes de marcar a fase como concluída.

## Status de execução do roadmap

- **Fase 1 (Fundação): concluída**
  - Setup base do projeto com Next.js + TypeScript + Tailwind.
  - Scripts de lint/typecheck/test/build definidos.
  - CI inicial em `.github/workflows/ci.yml`.
  - Padrão de variáveis de ambiente com `.env.example` e helper central.
