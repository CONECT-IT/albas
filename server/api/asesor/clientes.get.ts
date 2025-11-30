import { requireAuth } from "../../utils/auth";
import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  await requireAuth()(event);

  const user = event.context.user;
  const db = usePostgres();

  try {
    const rows = await db`
      SELECT
        p.id_persona,
        p.nombre,
        p.celular,
        p.tipo,
        c.fecha_emision,
        pr.id_propiedad,
        pr.direccion,
        c.id_contrato
      FROM contrato c
      INNER JOIN propiedad pr ON c.id_propiedad = pr.id_propiedad
      INNER JOIN propiedad_asesor pa ON pr.id_propiedad = pa.id_propiedad
      INNER JOIN personas p ON c.id_persona = p.id_persona
      WHERE pa.id_usuario = ${user.id}
    `.values();

    const clientes = rows.map((row) => ({
      id_persona: row[0],
      nombre: row[1],
      celular: row[2],
      tipo: row[3],
      fecha: row[4],
      propiedad: {
        id_propiedad: row[5],
        direccion: row[6],
      },
      contrato: {
        id_contrato: row[7],
      },
    }));

    return {
      status: "success",
      message: "Clientes del asesor retornados correctamente",
      data: clientes,
    };
  } catch (error) {
    console.error("[ERROR] Error obteniendo clientes del asesor:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  } finally {
    await db.end();
  }
});
