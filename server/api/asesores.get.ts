import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  const db = usePostgres();
  try {
    const asesores = await db`
      SELECT 
        u.id_usuario, 
        u.nombres,
        u.apellidos,
        i.tipo_interaccion, 
        i.fecha_hora
      FROM usuarios u 
      INNER JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
      INNER JOIN roles r ON ur.id_rol = r.id_rol
      LEFT JOIN LATERAL (
        SELECT 
          tipo_interaccion, 
          fecha_hora
        FROM interacciones
        WHERE id_usuario_asesor = u.id_usuario
        ORDER BY fecha_hora DESC
        LIMIT 1
      ) i ON true
      WHERE r.nombre_rol = 'ASESOR_VENTAS'
       `.values();
    await db.end();
    return {
      status: "success",
      message: "Asesores retornados correctamente",
      data: asesores
    };
  } catch (error) {
    console.error("[ERROR] Error obteniendo asesores:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  } finally {
    await db.end();
  }
});