import { requireRole } from "../../utils/auth";
import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  await requireRole(["Administrador", "admin", "administrador/a"])(event);

  const user = event.context.user;

  const db = usePostgres();
  try {
    const asesores = await db`
      SELECT
        u.id_usuario,
        u.nombre_usuario,
        u.nombres,
        u.apellidos,
        u.correo
      FROM usuarios u
      INNER JOIN rol r ON u.id_rol = r.id_rol
      WHERE r.nombre_rol = 'Asesor'
       `.values();

    return {
      status: "success",
      message: "Asesores retornados correctamente",
      data: asesores.map((asesor) => ({
        id_usuario: asesor[0],
        nombre_usuario: asesor[1],
        nombres: asesor[2],
        apellidos: asesor[3],
        correo: asesor[4],
      })),
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
