import fs from "node:fs";
import postgres from "postgres";

const sql = postgres(process.env.NUXT_POSTGRES_URL!, { ssl: false });

async function migrate() {
  console.log("[TASK] Ejecutando archivo SQL...");

  const script = fs.readFileSync("sql/schemas.sql", "utf8");
  await sql.unsafe(script);

  console.log("[OK] Migración completada.");
  await sql.end();
}

migrate().catch((err) => {
  console.error("[FAILED] Error al ejecutar migración:", err);
  process.exit(1);
});
