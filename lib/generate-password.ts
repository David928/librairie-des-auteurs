import { randomBytes } from "crypto";

export function generatePassword(): string {
  return randomBytes(9).toString("base64url");
}
