import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  const db = usePostgres();

  try {
    const leads = await db`
      SELECT 
        l.id_persona, 
        p.nombre, 
        le.nombre_estado,
        i.tipo_interaccion, 
        i.fecha_hora
      FROM leads l
      INNER JOIN lead_estados le ON l.id_estado = le.id_estado
      INNER JOIN personas p ON l.id_persona = p.id_persona
      LEFT JOIN LATERAL (
        SELECT 
          tipo_interaccion, 
          fecha_hora
        FROM interacciones
        WHERE id_lead = l.id_persona
        ORDER BY fecha_hora DESC
        LIMIT 1
      ) i ON true
       `.values();
    return {
      status: "success",
      message: "Leads retornados correctamente",
      data: leads
    };

  } catch (error) {
    console.error("[ERROR] Error obteniendo leads:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  } finally {
    await db.end();
  }
});