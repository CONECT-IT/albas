import { usePostgres } from "#imports";
import { scryptSync } from "node:crypto";

function hashPassword(plainPassword: string): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = scryptSync(plainPassword, salt, 64);

  const saltB64 = Buffer.from(salt).toString("base64");
  const hashB64 = Buffer.from(hash).toString("base64");

  return `${saltB64}.${hashB64}`;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { nombre_usuario, contrasena, correo, nombres, apellidos } = body;

  if (!nombre_usuario || !contrasena || !correo || !nombres) {
    throw createError({
      statusCode: 400,
      message: "Nombre de usuario, contraseña, correo y nombres son requeridos",
    });
  }

  const db = usePostgres();

  try {
    // Verificar si el nombre de usuario o correo ya existen
    const existingUser = await db`
      SELECT id_usuario 
      FROM usuarios 
      WHERE nombre_usuario = ${nombre_usuario} OR correo = ${correo}
    `.values();

    if (existingUser.length > 0) {
      await db.end();
      throw createError({
        statusCode: 409,
        message: "Nombre de usuario o correo electrónico ya existen",
      });
    }

    // Obtener el id del rol Asesor
    const rolAsesor = await db`
      SELECT id_rol 
      FROM rol 
      WHERE nombre_rol = 'Asesor'
    `.values();

    if (!rolAsesor || rolAsesor.length === 0) {
      await db.end();
      throw createError({
        statusCode: 404,
        message: "Rol 'Asesor' no encontrado",
      });
    }

    const hashedPassword = hashPassword(contrasena);

    const result = await db`
      INSERT INTO usuarios (
        nombre_usuario,
        contrasena,
        correo,
        nombres,
        apellidos,
        id_rol
      ) VALUES (
        ${nombre_usuario},
        ${hashedPassword},
        ${correo},
        ${nombres},
        ${apellidos || null},
        ${rolAsesor[0][0]}
      )
      RETURNING id_usuario, nombre_usuario, nombres, apellidos, correo
    `.values();

    await db.end();

    return {
      status: "success",
      message: "Asesor creado exitosamente",
      data: {
        id_usuario: result[0][0],
        nombre_usuario: result[0][1],
        nombres: result[0][2],
        apellidos: result[0][3],
        correo: result[0][4],
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
