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

  const db = usePostgres();

  try {
    let leads;

    const hasAdminRole = user.roles.some(
      (role) =>
        role.toLowerCase() === "administrador" ||
        role.toLowerCase() === "admin" ||
        role.toLowerCase() === "administrador/a",
    );

    if (hasAdminRole) {
      leads = await db`
        SELECT
          p.id_persona,
          p.nombre,
          p.tipo,
          p.celular,
          p.estado,
          u.nombre_usuario,
          u.nombres,
          u.apellidos
        FROM personas p
        LEFT JOIN citas c ON p.id_persona = c.id_persona
        LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
         `.values();
    } else {
      leads = await db`
        SELECT
          p.id_persona,
          p.nombre,
          p.tipo,
          p.celular,
          p.estado,
          u.nombre_usuario,
          u.nombres,
          u.apellidos
        FROM personas p
        INNER JOIN citas c ON p.id_persona = c.id_persona
        INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
        WHERE c.id_usuario = ${user.id}
         `.values();
    }

    return {
      status: "success",
      message: "Leads retornados correctamente",
      data: leads.map((lead) => ({
        id_persona: lead[0],
        nombre: lead[1],
        tipo: lead[2],
        celular: lead[3],
        estado: lead[4],
        asesor: {
          nombre_usuario: lead[5],
          nombres: lead[6],
          apellidos: lead[7],
        },
      })),
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
