import { scryptSync } from "node:crypto";
import { usePostgres } from "#imports";

function verifyPassword(
  hashedPassword: string,
  plainPassword: string,
): boolean {
  try {
    const [saltB64, hashB64] = hashedPassword.split(".");
    if (!saltB64 || !hashB64) {
      return false;
    }

    const salt = Buffer.from(saltB64, "base64");
    const expectedHash = Buffer.from(hashB64, "base64");

    const actualHash = scryptSync(plainPassword, salt, 64);

    return Buffer.compare(actualHash, expectedHash) === 0;
  } catch (error) {
    console.error("[ERROR] Error verificando password:", error);
    return false;
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Usuario y contraseña son requeridos",
    });
  }

  const db = usePostgres();
  const [user] = await db`
    SELECT id_usuario, nombre_usuario, password_hash, nombres, apellidos, telefono, fecha_contratacion, activo
    FROM usuarios
    WHERE nombre_usuario = ${username} AND activo = true
  `.values();

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Credenciales inválidas",
    });
  }

  const isValidPassword = verifyPassword(user[2], password);

  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: "Credenciales inválidas",
    });
  }

  await db`
    UPDATE usuarios
    SET last_login = NOW()
    WHERE id_usuario = ${user[0]}
  `;

  await setUserSession(event, {
    user: {
      id: user[0], // id_usuario
      username: user[1], // nombre_usuario
      name: `${user[3]} ${user[4]}`, // nombres + apellidos
      phone: user[5], // telefono
      hireDate: user[6], // fecha_contratacion
    },
    loggedInAt: new Date(),
  });

  await db.end();

  return {
    status: "success",
    message: "Login exitoso",
    user: {
      id: user[0],
      username: user[1],
      name: `${user[3]} ${user[4]}`,
    },
  };
});
