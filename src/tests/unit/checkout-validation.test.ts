import { describe, expect, it } from "vitest";
import { parseGuestEmail, parsePostalCode, parseRequiredString } from "@/lib/store/checkout-validation";

describe("checkout validation", () => {
  it("accepts valid guest email and normalizes case", () => {
    expect(parseGuestEmail("Cliente@Exemplo.com")).toBe("cliente@exemplo.com");
  });

  it("rejects invalid guest email", () => {
    expect(() => parseGuestEmail("email-invalido")).toThrow("E-mail inválido.");
  });

  it("normalizes postal code to digits", () => {
    expect(parsePostalCode("12345-678")).toBe("12345678");
  });

  it("rejects postal code with invalid length", () => {
    expect(() => parsePostalCode("1234")).toThrow("CEP inválido.");
  });

  it("requires non-empty string fields", () => {
    expect(parseRequiredString(" nome ", "nome")).toBe("nome");
    expect(() => parseRequiredString(" ", "nome")).toThrow("Campo obrigatório: nome");
  });
});
