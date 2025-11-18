import {scryptSync} from "node:crypto";
import {usePostgres} from "#imports";

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
  const {username, password} = body;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Usuario y contraseña son requeridos",
    });
  }

  const db = usePostgres();
  const [userData] = await db` 
    SELECT id_usuario, nombre_usuario, password_hash, nombres, apellidos, telefono, fecha_contratacion, activo
    FROM usuarios
    WHERE nombre_usuario = ${username} AND activo = true
  `.values();

  if (!userData) {
    throw createError({
      statusCode: 401,
      message: "Credenciales inválidas",
    });
  }

  const isValidPassword = verifyPassword(userData[2], password);

  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: "Credenciales inválidas",
    });
  }

  const userRoles = await db`
    SELECT r.nombre_rol
    FROM usuario_roles ur
    JOIN roles r ON ur.id_rol = r.id_rol
    WHERE ur.id_usuario = ${userData[0]}
  `.values();

  const roles = userRoles.map((role) => role[0]);

  await db`
    UPDATE usuarios
    SET last_login = NOW()
    WHERE id_usuario = ${userData[0]}
  `;

  await setUserSession(event, {
    user: {
      id: userData[0], // id_usuario
      username: userData[1], // nombre_usuario
      name: `${userData[3]} ${userData[4]}`, // nombres + apellidos
      phone: userData[5], // telefono
      hireDate: userData[6], // fecha_contratacion
      roles: roles,
    },
    loggedInAt: new Date(),
  });

  await db.end();

  return {
    status: "success",
    message: "Login exitoso",
    user: {
      id: userData[0],
      username: userData[1],
      name: `${userData[3]} ${userData[4]}`,
      roles: roles,
    },
  };
});
