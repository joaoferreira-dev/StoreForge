import { appConfig } from "@/lib/config/env";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16">
      <header className="mb-12 flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold">{appConfig.appName}</h1>
        <span className="rounded-full border border-gray-300 px-3 py-1 text-sm">Fase 1 concluída</span>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <article className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-2 text-xl font-medium">Fundação pronta</h2>
          <p className="text-brand-700">
            Base de projeto criada com App Router, TypeScript, Tailwind, lint, testes e CI.
          </p>
        </article>

        <article className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-2 text-xl font-medium">Próxima etapa</h2>
          <p className="text-brand-700">
            Fase 2: modelagem de domínio, migrações e seed para catálogo inicial.
          </p>
        </article>
      </section>
    </main>
  );
}
