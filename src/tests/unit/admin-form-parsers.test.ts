import { describe, expect, it } from "vitest";
import {
  centsToInputValue,
  parseMoneyToCents,
  parseOptionalMoneyToCents,
  parseOrderStatus,
  parseSlug,
  parseStringArray
} from "@/lib/admin/form-parsers";

function buildFormData(entries: Array<[string, string]>) {
  const formData = new FormData();
  for (const [key, value] of entries) {
    formData.append(key, value);
  }

  return formData;
}

describe("admin form parsers", () => {
  it("parseSlug accepts valid slug", () => {
    const formData = buildFormData([["slug", "casa-e-cozinha"]]);
    expect(parseSlug(formData, "slug", "slug")).toBe("casa-e-cozinha");
  });

  it("parseSlug rejects invalid slug", () => {
    const formData = buildFormData([["slug", "Casa e Cozinha"]]);
    expect(() => parseSlug(formData, "slug", "slug")).toThrow("slug inválido");
  });

  it("parseMoneyToCents parses decimal and comma format", () => {
    expect(parseMoneyToCents(buildFormData([["price", "12.34"]]), "price", "preço")).toBe(1234);
    expect(parseMoneyToCents(buildFormData([["price", "12,34"]]), "price", "preço")).toBe(1234);
  });

  it("parseOptionalMoneyToCents returns null when empty", () => {
    expect(parseOptionalMoneyToCents(buildFormData([]), "compareAtPrice", "preço comparativo")).toBeNull();
  });

  it("parseStringArray returns trimmed values", () => {
    const values = parseStringArray(
      buildFormData([
        ["categoryIds", " cat-a "],
        ["categoryIds", "cat-b"],
        ["categoryIds", " "]
      ]),
      "categoryIds"
    );

    expect(values).toEqual(["cat-a", "cat-b"]);
  });

  it("parseOrderStatus validates allowed values", () => {
    const valid = buildFormData([["status", "PROCESSING"]]);
    expect(parseOrderStatus(valid, "status")).toBe("PROCESSING");

    const invalid = buildFormData([["status", "UNKNOWN"]]);
    expect(() => parseOrderStatus(invalid, "status")).toThrow("Status de pedido inválido.");
  });

  it("centsToInputValue converts cents to decimal string", () => {
    expect(centsToInputValue(1099)).toBe("10.99");
  });
});
