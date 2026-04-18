# Plano de implementação — E-commerce funcional e dinâmico

## Estado atual do código
- A pasta do projeto (`C:\Users\joaob\OneDrive\Documentos\store`) está vazia no momento.
- Não há base existente de frontend, backend ou banco de dados para evoluir.
- O projeto será iniciado do zero (greenfield), com arquitetura e stack definidas no planejamento.

## Problema e abordagem proposta
Criar um e-commerce funcional e dinâmico, sem necessidade de cadastrar produtos reais agora, com frontend criativo e minimalista inspirado em padrões de usabilidade de marketplaces (incluindo referências visuais da Amazon, sem cópia direta de identidade visual, layout ou componentes proprietários).

Abordagem:
1. Definir stack e arquitetura (frontend, backend, banco, autenticação, pagamentos, deploy).
2. Construir MVP funcional com catálogo mockado, carrinho, checkout e painel admin básico.
3. Preparar base para evolução futura (produtos reais, integrações, SEO, analytics, observabilidade).

## Escopo do MVP (fechado)
- Home com vitrine dinâmica, busca, categorias e destaques.
- Página de listagem de produtos com filtros e ordenação.
- Página de produto com galeria, descrição e variações.
- Carrinho persistente.
- Checkout em múltiplas etapas com opção de convidado (guest checkout).
- Autenticação por e-mail/senha (cadastro, login, recuperação de senha).
- Área do cliente (pedidos, perfil, endereços).
- Backoffice inicial: CRUD de produtos/categorias, pedidos e usuários.
- Design system minimalista (tipografia limpa, grid consistente, microinterações leves).
- MVP em pt-BR e BRL, com arquitetura preparada para segunda língua/moeda no futuro.

## Arquitetura técnica (aprovada)
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS + componentes acessíveis.
- Backend: API Routes/Server Actions no Next.js para MVP (com possibilidade de extrair para serviço dedicado depois).
- Banco de dados: PostgreSQL + Prisma ORM.
- Cache e sessão: Redis (opcional no MVP; pode entrar na fase 2).
- Upload de imagens: S3 compatível (ou serviço equivalente).
- Pagamentos: Stripe (modo teste) com Cartão + PIX.
- Auth: credenciais (e-mail/senha).
- Deploy: Vercel (frontend/API) + provedor gerenciado para Postgres.

## Fases de execução
1. Fundação do projeto
   - Setup do monorepo/single-repo, lint, formatação, scripts, CI básico.
   - Definição de padrões de pastas, ambiente e variáveis.
   - Encerramento da fase: criar branch de trabalho, realizar commit e push para abrir PR automático para `master`.
2. Núcleo de domínio
   - Modelagem de dados (usuários, produtos, categorias, carrinho, pedidos, pagamentos).
   - Migrações e seed com produtos mockados.
   - Encerramento da fase: criar branch de trabalho, realizar commit e push para abrir PR automático para `master`.
3. Experiência de compra (frontend)
   - Home, listagem, PDP, busca, filtros, carrinho e checkout.
   - Encerramento da fase: criar branch de trabalho, realizar commit e push para abrir PR automático para `master`.
4. Operação (admin/backoffice)
   - CRUD de catálogo, acompanhamento de pedidos e controle de status.
   - Encerramento da fase: criar branch de trabalho, realizar commit e push para abrir PR automático para `master`.
5. Qualidade, performance e segurança
   - Testes essenciais, hardening de auth, validação de input, SEO técnico e métricas.
   - Encerramento da fase: criar branch de trabalho, realizar commit e push para abrir PR automático para `master`.
6. Go-live controlado
   - Deploy staging, validações finais, produção e monitoramento inicial.
   - Encerramento da fase: criar branch de trabalho, realizar commit e push para abrir PR automático para `master`.

## Status de execução do roadmap

### Fase 1 (Fundação) — concluída
- Setup base do projeto com Next.js + TypeScript + Tailwind.
- Scripts de lint, typecheck, testes e build definidos.
- CI inicial e helper central de variáveis de ambiente.

### Fase 2 (Núcleo de domínio) — concluída
**Introdução breve:** nesta fase foi criada a base de domínio e persistência do e-commerce para suportar catálogo, carrinho e pedidos nas próximas entregas. A modelagem foi estruturada em Prisma com foco em evolução incremental do MVP.

**Critérios de aceite da fase:**
1. Modelagem de dados cobre usuários, produtos, categorias, carrinho, pedidos, pagamentos e endereços.
2. Projeto possui base de migração e geração de cliente Prisma via scripts de banco.
3. Seed idempotente popula catálogo mockado para desenvolvimento local.
4. Encerramento técnico da fase executado com lint, typecheck e testes.

### Fase 3 (Experiência de compra) — concluída
**Introdução breve:** nesta fase foi entregue a experiência principal de compra no frontend, conectando catálogo, carrinho e checkout sobre o domínio já modelado na fase anterior.

**Critérios de aceite da fase:**
1. Home com vitrine de produtos, busca e navegação por categorias.
2. PLP com busca textual, filtro por categoria e ordenação por preço.
3. PDP com detalhes do produto e ação de adicionar ao carrinho.
4. Carrinho persistente por sessão e checkout de convidado com criação de pedido.
5. Encerramento técnico da fase executado com lint, typecheck e testes.

### Fase 4 (Operação / admin-backoffice) — concluída
**Introdução breve:** nesta fase foi implementada a camada operacional do MVP para gestão de catálogo e pedidos no backoffice.

**Critérios de aceite da fase:**
1. Painel administrativo disponível em `/admin` com visão operacional de pedidos.
2. CRUD de categorias implementado em `/admin/categorias`.
3. CRUD de produtos implementado em `/admin/produtos`, incluindo associação a categorias.
4. Atualização de status de pedidos disponível no painel de administração.
5. Encerramento técnico da fase executado com lint, typecheck e testes.

### Fase 5 (Qualidade, performance e segurança) — concluída
**Introdução breve:** nesta fase o projeto recebeu hardening de acesso administrativo, reforço de validações de checkout, melhorias de SEO técnico e endpoint de métricas operacionais.

**Critérios de aceite da fase:**
1. Admin protegido por login e sessão, com checagem de autorização nas rotas e server actions.
2. Usuário sem sessão admin não visualiza entrada de admin no menu principal.
3. Checkout com validação de e-mail/CEP e decremento de estoque com condição atômica para evitar overselling.
4. SEO técnico com geração de `robots.txt` e `sitemap.xml`.
5. Endpoint de métricas operacionais em `/api/metrics` restrito a sessão admin.
6. Encerramento técnico da fase executado com lint, typecheck e testes.

## Decisões confirmadas
- Modelo da loja: B2C, vendedor único.
- Checkout: convidado permitido.
- Pagamento no MVP: Cartão + PIX.
- Frete no MVP: integração real com transportadora/Correios desde o início.
- Estoque: controle real (baixa por pedido e bloqueio sem saldo).
- Login: somente e-mail/senha.
- Idioma e moeda no MVP: pt-BR + BRL, com escalabilidade para multi-idioma/moeda.
- Canais: apenas web responsivo (sem app nativo no MVP).
- Admin do MVP: catálogo + pedidos + clientes.
- Compliance inicial: LGPD + termos/políticas; sem emissão automática de NF no MVP.
- Visual: minimalista claro, alto contraste e foco em conversão.
- Todo novo código implementado deve incluir testes unitários correspondentes.

## Todos planejados
1. Escolher stack final e arquitetura de execução do MVP.
2. Definir identidade visual e regras de inspiração (evitar cópia).
3. Modelar entidades e fluxos de compra.
4. Implementar frontend público (home, PLP, PDP, busca/filtros).
5. Implementar carrinho e checkout.
6. Implementar autenticação e área do cliente.
7. Implementar painel admin inicial.
8. Integrar pagamento em ambiente de teste (Cartão + PIX).
9. Integrar cálculo de frete real com transportadora/Correios.
10. Implementar controle de estoque real no fluxo de compra.
11. Configurar SEO, analytics e observabilidade mínima.
12. Implementar base de compliance (LGPD + termos/políticas).
13. Preparar deploy e ambiente de produção.

## Pontos em aberto (não bloqueantes para começar)
- Qual provedor logístico será priorizado na primeira integração (Correios direto vs gateway de frete)?
- Quais provedores de e-mail transacional serão usados (login, recuperação de senha e comunicações)?
- Qual solução de storage/imagens será adotada no primeiro deploy (S3, Cloudinary ou equivalente)?

## Notas importantes
- Como não há definição de produtos ainda, o seed inicial usará catálogo fictício para validar toda a jornada de compra.
- A inspiração no layout da Amazon será restrita a padrões gerais de usabilidade (navegação, clareza, hierarquia), sem copiar elementos proprietários de marca/identidade.
