import { redirect } from "next/navigation";
import { canUseAdminAuth, isAdminAuthenticated } from "@/lib/auth/admin-session";

export async function requireAdminPageAccess() {
  if (!canUseAdminAuth()) {
    redirect("/");
  }

  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function requireAdminActionAccess() {
  if (!canUseAdminAuth() || !(await isAdminAuthenticated())) {
    throw new Error("Acesso não autorizado.");
  }
}
