export function getRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const appConfig = {
  appName: getRequiredEnv("NEXT_PUBLIC_APP_NAME", "Store"),
  appUrl: getRequiredEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
};

export const runtimeConfig = {
  hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
  hasAdminCredentials: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET)
};
