import { afterEach, describe, expect, it } from "vitest";
import { canUseAdminAuth, validateAdminLogin } from "@/lib/auth/admin-session";

const originalEnv = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  AUTH_SECRET: process.env.AUTH_SECRET
};

function setAdminEnv() {
  process.env.ADMIN_EMAIL = "admin@store.com";
  process.env.ADMIN_PASSWORD = "admin123";
  process.env.AUTH_SECRET = "secret-test";
}

afterEach(() => {
  process.env.ADMIN_EMAIL = originalEnv.ADMIN_EMAIL;
  process.env.ADMIN_PASSWORD = originalEnv.ADMIN_PASSWORD;
  process.env.AUTH_SECRET = originalEnv.AUTH_SECRET;
});

describe("admin session auth", () => {
  it("validates configured admin credentials", () => {
    setAdminEnv();
    expect(canUseAdminAuth()).toBe(true);
    expect(validateAdminLogin("admin@store.com", "admin123")).toBe(true);
    expect(validateAdminLogin("admin@store.com", "wrong")).toBe(false);
  });

  it("rejects when auth config is missing", () => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.AUTH_SECRET;
    expect(canUseAdminAuth()).toBe(false);
    expect(validateAdminLogin("admin@store.com", "admin123")).toBe(false);
  });
});
