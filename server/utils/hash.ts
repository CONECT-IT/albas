import { scryptSync, randomBytes } from "node:crypto";

export function hashContrasena(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return salt.toString("base64") + "." + hash.toString("base64");
}

export function verificarContrasena(hashedPassword: string, plainPassword: string): boolean {
  try {
    const [saltB64, hashB64] = hashedPassword.split(".");
    if (!saltB64 || !hashB64) {
      return false;
    }

    const salt = Buffer.from(saltB64, "base64");
    const expectedHash = Buffer.from(hashB64, "base64");
    const actualHash = scryptSync(plainPassword, salt, 64);

    return Buffer.compare(actualHash, expectedHash) === 0;
  } catch (error) {
    console.error("[ERROR] Error verificando password:", error);
    return false;
  }
}
