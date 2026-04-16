import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/lib/store/currency";

describe("formatCurrency", () => {
  it("formats BRL values from cents", () => {
    const formatted = formatCurrency(34990);
    expect(formatted).toContain("349,90");
    expect(formatted.startsWith("R$")).toBe(true);
  });

  it("formats zero correctly", () => {
    const formatted = formatCurrency(0);
    expect(formatted).toContain("0,00");
  });
});
