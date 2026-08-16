import {
  compare,
  hash,
} from "bcryptjs";

const PASSWORD_HASH_ROUNDS = 12;
const MINIMUM_PASSWORD_LENGTH = 8;
const MAXIMUM_BCRYPT_PASSWORD_BYTES = 72;

export function getPasswordValidationError(
  password: string,
): string | null {
  if (password.length < MINIMUM_PASSWORD_LENGTH) {
    return `Password must contain at least ${MINIMUM_PASSWORD_LENGTH} characters.`;
  }

  if (
    Buffer.byteLength(password, "utf8") >
    MAXIMUM_BCRYPT_PASSWORD_BYTES
  ) {
    return "Password is too long.";
  }

  return null;
}

export async function hashPassword(
  password: string,
): Promise<string> {
  return hash(password, PASSWORD_HASH_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return compare(password, passwordHash);
}