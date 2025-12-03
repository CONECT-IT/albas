import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
const body = await readBody(event);
  const { nombre, celular, tipo} = body;

  if (!nombre || !celular || !tipo) {
    throw createError({
      statusCode: 400,
      message: "Nombre, Celular y Tipo son requeridos",
    });
  }

  const db = usePostgres();

  try {
    // Verificar si el nombre ya existe
    const existingUser = await db`
      SELECT id_persona
      FROM personas
      WHERE nombre = ${nombre}
    `.values();

    if (existingUser.length > 0) {
      await db.end();
      throw createError({
        statusCode: 409,
        message: "Nombre ya existe",
      });
    }

    const result = await db`
      INSERT INTO personas (
        nombre,
        celular,
        tipo
      ) VALUES (
        ${nombre},
        ${celular},
        ${tipo}
      )
      RETURNING nombre, celular, tipo
    `.values();

    await db.end();

    return {
      status: "success",
      message: "Lead creado exitosamente",
      data: {
        nombre: result[0][0],
        celular: result[0][1],
        tipo: result[0][2]
      },
    };
  } catch (error) {
    console.error("[ERROR] Error creando asesor:", error);
    await db.end();

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  }
});