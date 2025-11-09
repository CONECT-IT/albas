import { requireAuth } from "../../utils/auth";
import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  await requireAuth()(event);

  const user = event.context.user;

  const db = usePostgres();
  try {
    const userData = await db`
      SELECT
        u.id_usuario,
        u.nombre_usuario,
        u.nombres,
        u.apellidos,
        u.correo,
        r.nombre_rol
      FROM usuarios u
      INNER JOIN rol r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = ${user.id}
       `.values();

    if (userData.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Usuario no encontrado",
      });
    }

    const userInfo = userData[0];

    return {
      status: "success",
      message: "Información del usuario retornada correctamente",
      data: {
        id_usuario: userInfo[0],
        nombre_usuario: userInfo[1],
        nombres: userInfo[2],
        apellidos: userInfo[3],
        correo: userInfo[4],
        rol: userInfo[5],
      },
    };
  } catch (error) {
    console.error("[ERROR] Error obteniendo información del usuario:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  } finally {
    await db.end();
  }
});
