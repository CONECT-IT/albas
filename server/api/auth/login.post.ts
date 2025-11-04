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

  const userWithRoles = await db`
    SELECT
      u.id_usuario,
      u.nombre_usuario,
      u.password_hash,
      u.nombres,
      u.apellidos,
      u.telefono,
      u.fecha_contratacion,
      u.activo,
      u.last_login,
      array_agg(r.nombre_rol) FILTER (WHERE r.nombre_rol IS NOT NULL) AS roles
    FROM usuarios u
    LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    WHERE u.nombre_usuario = ${username} AND u.activo = true
    GROUP BY u.id_usuario, u.nombre_usuario, u.password_hash, u.nombres, u.apellidos, u.telefono, u.fecha_contratacion, u.activo, u.last_login
  `.values();

  if (!userWithRoles || userWithRoles.length === 0) {
    await db.end();
    throw createError({
      statusCode: 401,
      message: "Credenciales inválidas",
    });
  }

  const userData = userWithRoles[0];
  const isValidPassword = verifyPassword(userData[2], password);

  if (!isValidPassword) {
    await db.end();
    throw createError({
      statusCode: 401,
      message: "Credenciales inválidas",
    });
  }

  await db`
    UPDATE usuarios
    SET last_login = NOW()
    WHERE id_usuario = ${userData[0]}
  `;

  const roles = userData[9] || [];

  await setUserSession(event, {
    user: {
      id: userData[0], // id_usuario
      username: userData[1], // nombre_usuario
      name: `${userData[3]} ${userData[4]}`, // nombres + apellidos
      phone: userData[5], // telefono
      hireDate: userData[6], // fecha_contratacion
      roles: Array.isArray(roles) ? roles : [],
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
      roles: Array.isArray(roles) ? roles : [],
    },
  };
});
