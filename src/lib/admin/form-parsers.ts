import { ORDER_STATUS_OPTIONS, type OrderStatusOption } from "@/lib/admin/backoffice";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function getFieldValue(formData: FormData, fieldName: string) {
  return formData.get(fieldName);
}

function normalizeString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function parseRequiredString(formData: FormData, fieldName: string, label: string) {
  const normalized = normalizeString(getFieldValue(formData, fieldName));
  if (!normalized) {
    throw new Error(`Campo obrigatório: ${label}.`);
  }

  return normalized;
}

export function parseOptionalString(formData: FormData, fieldName: string) {
  const normalized = normalizeString(getFieldValue(formData, fieldName));
  return normalized.length > 0 ? normalized : null;
}

export function parseSlug(formData: FormData, fieldName: string, label: string) {
  const slug = parseRequiredString(formData, fieldName, label);

  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`${label} inválido. Use apenas letras minúsculas, números e hífen.`);
  }

  return slug;
}

export function parseNonNegativeInt(formData: FormData, fieldName: string, label: string) {
  const value = parseRequiredString(formData, fieldName, label);
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed < 0) {
    throw new Error(`${label} inválido.`);
  }

  return parsed;
}

function parseMoneyStringToCents(value: string, label: string) {
  const normalized = value.replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed < 0) {
    throw new Error(`${label} inválido.`);
  }

  return Math.round(parsed * 100);
}

export function parseMoneyToCents(formData: FormData, fieldName: string, label: string) {
  const value = parseRequiredString(formData, fieldName, label);
  return parseMoneyStringToCents(value, label);
}

export function parseOptionalMoneyToCents(formData: FormData, fieldName: string, label: string) {
  const normalized = normalizeString(getFieldValue(formData, fieldName));
  if (!normalized) {
    return null;
  }

  return parseMoneyStringToCents(normalized, label);
}

export function parseBooleanFromCheckbox(formData: FormData, fieldName: string) {
  return getFieldValue(formData, fieldName) === "on";
}

export function parseStringArray(formData: FormData, fieldName: string) {
  return formData
    .getAll(fieldName)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function parseOrderStatus(formData: FormData, fieldName: string) {
  const status = parseRequiredString(formData, fieldName, "status");
  if (!ORDER_STATUS_OPTIONS.includes(status as OrderStatusOption)) {
    throw new Error("Status de pedido inválido.");
  }

  return status as OrderStatusOption;
}

export function centsToInputValue(value: number) {
  return (value / 100).toFixed(2);
}
