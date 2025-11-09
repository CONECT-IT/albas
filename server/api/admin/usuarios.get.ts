import { requireRole } from "../../utils/auth";
import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  await requireRole(["Administrador", "admin", "administrador/a"])(event);

  const user = event.context.user;

  const db = usePostgres();
  try {
    const allUsers = await db`
      SELECT
        u.id_usuario,
        u.nombre_usuario,
        u.nombres,
        u.apellidos,
        u.correo,
        r.nombre_rol
      FROM usuarios u
      INNER JOIN rol r ON u.id_rol = r.id_rol
       `.values();

    return {
      status: "success",
      message: "Usuarios retornados correctamente",
      data: allUsers.map((userData) => ({
        id_usuario: userData[0],
        nombre_usuario: userData[1],
        nombres: userData[2],
        apellidos: userData[3],
        correo: userData[4],
        rol: userData[5],
      })),
    };
  } catch (error) {
    console.error("[ERROR] Error obteniendo usuarios:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  } finally {
    await db.end();
  }
});
