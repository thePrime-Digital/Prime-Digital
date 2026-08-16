const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

export function normaliseName(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ");
}

export function normaliseEmail(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

export function normalisePhone(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/[\s()-]/g, "");
}

export function isValidName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

export function isValidEmail(email: string): boolean {
  return (
    email.length <= 254 &&
    EMAIL_PATTERN.test(email)
  );
}

export function isValidPhone(phone: string): boolean {
  return PHONE_PATTERN.test(phone);
}