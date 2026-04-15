import { afterEach, describe, expect, it } from "vitest";
import { getRequiredEnv } from "@/lib/config/env";

describe("getRequiredEnv", () => {
  afterEach(() => {
    delete process.env.TEST_ENV_KEY;
  });

  it("returns existing environment variable", () => {
    process.env.TEST_ENV_KEY = "value";
    expect(getRequiredEnv("TEST_ENV_KEY")).toBe("value");
  });

  it("returns fallback when env is missing", () => {
    expect(getRequiredEnv("TEST_ENV_KEY", "fallback")).toBe("fallback");
  });

  it("throws when both env and fallback are missing", () => {
    expect(() => getRequiredEnv("TEST_ENV_KEY")).toThrow("Missing required environment variable");
  });
});
