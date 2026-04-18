const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_CODE_DIGITS = 8;

export function parseRequiredString(value: FormDataEntryValue | null, fieldName: string) {
  if (typeof value !== "string") {
    throw new Error(`Campo obrigatório: ${fieldName}`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`Campo obrigatório: ${fieldName}`);
  }

  return normalized;
}

export function parseGuestEmail(value: FormDataEntryValue | null) {
  const email = parseRequiredString(value, "email").toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error("E-mail inválido.");
  }

  return email;
}

export function parsePostalCode(value: FormDataEntryValue | null) {
  const postalCode = parseRequiredString(value, "CEP");
  const digitsOnly = postalCode.replace(/\D/g, "");
  if (digitsOnly.length !== POSTAL_CODE_DIGITS) {
    throw new Error("CEP inválido.");
  }

  return digitsOnly;
}
