# Store

Base inicial do e-commerce em Next.js (App Router), TypeScript e Tailwind.

## Comandos

```bash
npm install
npm run dev
```

Outros comandos:

- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:single`

## Admin (fase 5)

- Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `AUTH_SECRET` no ambiente.
- Acesso do backoffice via `/admin/login`.
- O menu "Admin" só aparece quando a sessão administrativa está autenticada.

## Estrutura inicial

- `src/app`: rotas e layouts do App Router.
- `src/lib`: utilitários e configurações compartilhadas.
- `src/tests`: testes automatizados.
- `docs/initial_plan.md`: planejamento funcional e técnico do projeto.
