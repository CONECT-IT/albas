import { scryptSync } from "node:crypto";

export function hashPassword(plainPassword: string): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = scryptSync(plainPassword, salt, 64);

  const saltB64 = Buffer.from(salt).toString("base64");
  const hashB64 = Buffer.from(hash).toString("base64");

  return `${saltB64}.${hashB64}`;
}
