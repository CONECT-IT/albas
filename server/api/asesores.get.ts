import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const user = session?.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "No autenticado",
    });
  }

  const hasAdminRole = user.roles.some(
    (role) =>
      role.toLowerCase() === "administrador" ||
      role.toLowerCase() === "admin" ||
      role.toLowerCase() === "administrador/a",
  );

  if (!hasAdminRole) {
    throw createError({
      statusCode: 403,
      message: "Acceso denegado. Requiere rol de administrador",
    });
  }

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
