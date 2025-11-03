import { scryptSync, randomBytes } from "node:crypto";
import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";

function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return salt.toString("base64") + "." + hash.toString("base64");
}

const sql = postgres(process.env.NUXT_POSTGRES_URL!, { ssl: false });

async function seed() {
  console.log("🚀 Iniciando migración de datos...");

  const seedSqlPath = path.resolve("./sql/seed.sql");
  const rawSql = fs.readFileSync(seedSqlPath, "utf-8");

  await sql.unsafe(rawSql);

  const adminUser = {
    username: "william_admin",
    password: hashPassword("admin123"),
    nombres: "William",
    apellidos: "Vargas",
    telefono: "987654321",
  };

  await sql`
    UPDATE usuarios
    SET password_hash = ${adminUser.password}
    WHERE nombre_usuario = ${adminUser.username}
  `;

  console.log("[OK] Datos base insertados y usuario admin hasheado.");
  await sql.end();
}

seed().catch((err) => {
  console.error("[FAILED] Error ejecutando seed:", err);
  process.exit(1);
});
