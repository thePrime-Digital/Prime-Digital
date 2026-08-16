const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

export function cleanText(
  value: unknown,
  maximumLength = 500,
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maximumLength);
}

export function cleanMultilineText(
  value: unknown,
  maximumLength = 5000,
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maximumLength);
}

export function cleanEmail(value: unknown): string {
  return cleanText(value, 254).toLowerCase();
}

export function cleanPhone(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/[\s()-]/g, "")
    .slice(0, 16);
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export function isValidPhone(phone: string): boolean {
  return PHONE_PATTERN.test(phone);
}

export function isValidHttpUrl(value: string): boolean {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}
