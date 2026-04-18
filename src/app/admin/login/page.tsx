import { redirect } from "next/navigation";
import { adminLoginAction } from "@/app/actions/admin-auth";
import { canUseAdminAuth, isAdminAuthenticated } from "@/lib/auth/admin-session";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  if (!canUseAdminAuth()) {
      return (
      <main className="mx-auto min-h-screen w-full max-w-xl px-6 py-16">
        <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Login administrativo indisponível</h1>
          <p className="mt-2 text-sm text-gray-600">A autenticação administrativa não está habilitada neste ambiente.</p>
        </section>
      </main>
    );
  }

  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-6 py-16">
      <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Área administrativa</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Entrar no admin</h1>
        <p className="mt-2 text-sm text-gray-600">Acesso restrito para operação da loja.</p>

        {hasError ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">Credenciais inválidas.</p> : null}

        <form action={adminLoginAction} className="mt-5 grid gap-4">
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            E-mail admin
            <input
              required
              type="email"
              name="email"
              autoComplete="username"
              className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Senha admin
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              className="rounded-md border border-gray-300 px-3 py-2 outline-none ring-gray-900 focus:ring-2"
            />
          </label>
          <button type="submit" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
