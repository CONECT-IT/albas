import { requireAuth } from "../../utils/auth";
import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  await requireAuth()(event);

  const user = event.context.user;
  const db = usePostgres();

  try {
    const rows = await db`
      SELECT
        c.id_cita,
        c.fecha_agendada,
        c.observacion,
        c.estado_visita_guiada,
        p.id_persona,
        p.nombre,
        p.celular
      FROM citas c
      INNER JOIN personas p ON c.id_persona = p.id_persona
      WHERE c.id_usuario = ${user.id}
      ORDER BY c.fecha_agendada DESC
    `.values();

    const citas = rows.map((row) => ({
      id_cita: row[0],
      fecha_agendada: row[1],
      observacion: row[2],
      estado_visita_guiada: row[3],
      persona: {
        id_persona: row[4],
        nombre: row[5],
        celular: row[6],
      },
    }));

    return {
      status: "success",
      message: "Citas del asesor retornadas correctamente",
      data: citas,
    };
  } catch (error) {
    console.error("[ERROR] Error obteniendo citas del asesor:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  } finally {
    await db.end();
  }
});
