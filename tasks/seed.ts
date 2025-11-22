import { scryptSync, randomBytes } from "node:crypto";
import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";

function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return salt.toString("base64") + "." + hash.toString("base64");
}

const sql = postgres(process.env.NUXT_POSTGRES_URL!, {
  ssl: false,
});

async function seed() {
  console.log("🚀 Iniciando migración de datos...");

  const seedSqlPath = path.resolve("./sql/seed.sql");
  const rawSql = fs.readFileSync(seedSqlPath, "utf8");

  await sql.unsafe(rawSql);

  const plainPasswordUsers = await sql`
    SELECT id_usuario, contrasena 
    FROM usuarios 
    WHERE contrasena NOT LIKE '$2a$%'
  `;

  for (const user of plainPasswordUsers) {
    const hashedPassword = hashPassword(user.contrasena);

    await sql`
      UPDATE usuarios
      SET contrasena = ${hashedPassword}
      WHERE id_usuario = ${user.id_usuario}
    `;
  }

  console.log("[OK] Datos base insertados y contraseñas de usuarios hasheadas.");
  await sql.end();
}

seed().catch((err) => {
  console.error("[FAILED] Error ejecutando seed:", err);
  process.exit(1);
});
