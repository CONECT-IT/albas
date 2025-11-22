import { usePostgres } from "#imports";
import { scryptSync } from "node:crypto";

/**
 * HU-56: Actualización de datos de asesores
 */

function hashPassword(plainPassword: string): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = scryptSync(plainPassword, salt, 64);

  const saltB64 = Buffer.from(salt).toString("base64");
  const hashB64 = Buffer.from(hash).toString("base64");

  return `${saltB64}.${hashB64}`;
}

export default defineEventHandler(async (event) => {
  let body: any;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: "El cuerpo de la solicitud debe ser JSON válido",
    });
  }

  // Validación de entradas
  const { id_usuario, nombre_usuario, contrasena, correo, nombres, apellidos } = body;

  if (!id_usuario) {
    throw createError({
      statusCode: 400,
      message: "El ID del usuario es obligatorio para actualizar",
    });
  }

  const idNumerico = Number(id_usuario);
  if (isNaN(idNumerico) || idNumerico <= 0) {
    throw createError({
      statusCode: 400,
      message: "El ID del usuario debe ser un número positivo válido",
    });
  }

  // Si se envía un campo, debe tener contenido válido
  if (nombre_usuario !== undefined) {
    if (typeof nombre_usuario !== "string" || nombre_usuario.trim() === "") {
      throw createError({
        statusCode: 400,
        message: "El nombre de usuario no puede estar vacío si se proporciona",
      });
    }
  }

  if (nombres !== undefined) {
    if (typeof nombres !== "string" || nombres.trim() === "") {
      throw createError({
        statusCode: 400,
        message: "Los nombres no pueden estar vacíos si se proporcionan",
      });
    }
  }

  if (correo !== undefined) {
    if (typeof correo !== "string" || correo.trim() === "") {
      throw createError({
        statusCode: 400,
        message: "El correo no puede estar vacío si se proporciona",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      throw createError({
        statusCode: 400,
        message: "El formato del correo electrónico no es válido",
      });
    }
  }

  if (contrasena !== undefined) {
    if (typeof contrasena !== "string" || contrasena.length < 8) {
      throw createError({
        statusCode: 400,
        message: "La contraseña debe tener al menos 8 caracteres",
      });
    }
  }

  const nombreUsuarioSanitizado = nombre_usuario?.trim();
  const correoSanitizado = correo?.trim().toLowerCase();
  const nombresSanitizado = nombres?.trim();
  const apellidosSanitizado = apellidos?.trim() || null;

  const db = usePostgres();
  let usuarioActualizadoId: number | null = null;

  try {
    const usuarioExistente = await db`
      SELECT id_usuario, nombre_usuario, correo
      FROM usuarios
      WHERE id_usuario = ${idNumerico}
    `.values();

    if (usuarioExistente.length === 0) {
      throw createError({
        statusCode: 404,
        message: `No se encontró un asesor con ID ${idNumerico}`,
      });
    }

    // Solo si se están actualizando estos campos
    if (nombreUsuarioSanitizado || correoSanitizado) {
      const condiciones = [];
      const valores: any[] = [];

      if (nombreUsuarioSanitizado) {
        condiciones.push(`nombre_usuario = $${valores.length + 1}`);
        valores.push(nombreUsuarioSanitizado);
      }

      if (correoSanitizado) {
        condiciones.push(`correo = $${valores.length + 1}`);
        valores.push(correoSanitizado);
      }

      const conflictos = await db`
        SELECT id_usuario, nombre_usuario, correo
        FROM usuarios
        WHERE (nombre_usuario = ${nombreUsuarioSanitizado || null}
               OR correo = ${correoSanitizado || null})
          AND id_usuario != ${idNumerico}
      `.values();

      if (conflictos.length > 0) {
        const campoConflicto =
          conflictos[0][1] === nombreUsuarioSanitizado ? "nombre de usuario" : "correo electrónico";

        throw createError({
          statusCode: 409,
          message: `El ${campoConflicto} ya está en uso por otro usuario`,
        });
      }
    }

    const camposActualizar: string[] = [];
    const valoresActualizar: any[] = [];
    let paramIndex = 1;

    if (nombreUsuarioSanitizado !== undefined) {
      camposActualizar.push(`nombre_usuario = $${paramIndex++}`);
      valoresActualizar.push(nombreUsuarioSanitizado);
    }

    if (correoSanitizado !== undefined) {
      camposActualizar.push(`correo = $${paramIndex++}`);
      valoresActualizar.push(correoSanitizado);
    }

    if (nombresSanitizado !== undefined) {
      camposActualizar.push(`nombres = $${paramIndex++}`);
      valoresActualizar.push(nombresSanitizado);
    }

    if (apellidosSanitizado !== undefined) {
      camposActualizar.push(`apellidos = $${paramIndex++}`);
      valoresActualizar.push(apellidosSanitizado);
    }

    if (contrasena !== undefined) {
      const hashedPassword = hashPassword(contrasena);
      camposActualizar.push(`contrasena = $${paramIndex++}`);
      valoresActualizar.push(hashedPassword);
    }

    if (camposActualizar.length === 0) {
      throw createError({
        statusCode: 400,
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    const updateQuery = `
      UPDATE usuarios
      SET ${camposActualizar.join(", ")}
      WHERE id_usuario = $${paramIndex}
      RETURNING id_usuario, nombre_usuario, nombres, apellidos, correo
    `;

    valoresActualizar.push(idNumerico);

    const result = await db.unsafe(updateQuery, valoresActualizar).values();

    usuarioActualizadoId = result[0][0];

    console.assert(
      result.length === 1,
      `ERROR LÓGICO: Se esperaba actualizar 1 registro, pero se actualizaron ${result.length}`,
    );

    console.assert(
      usuarioActualizadoId === idNumerico,
      `ERROR LÓGICO: El ID retornado (${usuarioActualizadoId}) no coincide con el ID enviado (${idNumerico})`,
    );

    if (nombreUsuarioSanitizado !== undefined) {
      console.assert(
        result[0][1] === nombreUsuarioSanitizado,
        `ERROR LÓGICO: El nombre_usuario no se actualizó correctamente. Esperado: ${nombreUsuarioSanitizado}, Obtenido: ${result[0][1]}`,
      );
    }

    if (correoSanitizado !== undefined) {
      console.assert(
        result[0][4] === correoSanitizado,
        `ERROR LÓGICO: El correo no se actualizó correctamente. Esperado: ${correoSanitizado}, Obtenido: ${result[0][4]}`,
      );
    }

    console.log(
      `Asesor actualizado exitosamente: ID=${usuarioActualizadoId}, Campos=${camposActualizar.length}`,
    );

    await db.end();

    return {
      status: "success",
      message: "Asesor actualizado exitosamente",
      data: {
        id_usuario: result[0][0],
        nombre_usuario: result[0][1],
        nombres: result[0][2],
        apellidos: result[0][3],
        correo: result[0][4],
      },
    };
  } catch (error: any) {
    console.error("[ERROR] Error actualizando asesor:", error);

    try {
      await db.end();
      console.log("Conexión a BD cerrada después de error");
    } catch (closeError) {
      console.error("Error al cerrar conexión:", closeError);
    }

    if (error.statusCode) {
      throw error;
    }

    if (error.code === "23505") {
      throw createError({
        statusCode: 409,
        message: "El nombre de usuario o correo ya existe en el sistema",
      });
    }

    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      throw createError({
        statusCode: 503,
        message: "El servicio de base de datos no está disponible. Intente más tarde.",
      });
    }

    if (error.code === "ETIMEDOUT") {
      throw createError({
        statusCode: 504,
        message: "La operación excedió el tiempo de espera. Intente nuevamente.",
      });
    }

    if (error.code === "42601" || error.code === "42P01") {
      console.error("ERROR CRÍTICO DE SQL:", error.message);
      throw createError({
        statusCode: 500,
        message: "Error interno del servidor. Contacte al administrador.",
      });
    }

    throw createError({
      statusCode: 500,
      message: "Error interno del servidor al actualizar el asesor",
    });
  } finally {
    await db.end();
  }
});
