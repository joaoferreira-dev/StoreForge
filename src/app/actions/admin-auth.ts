"use server";

import { redirect } from "next/navigation";
import { clearAdminSessionCookie, issueAdminSessionCookie, validateAdminLogin } from "@/lib/auth/admin-session";

function parseRequiredField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

export async function adminLoginAction(formData: FormData) {
  const email = parseRequiredField(formData, "email");
  const password = parseRequiredField(formData, "password");

  if (!email || !password || !validateAdminLogin(email, password)) {
    redirect("/admin/login?error=1");
  }

  await issueAdminSessionCookie();
  redirect("/admin");
}

export async function adminLogoutAction() {
  await clearAdminSessionCookie();
  redirect("/");
}
