import { usePostgres } from "#imports";

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
      u.contrasena,
      u.nombres,
      u.apellidos,
      u.correo,
      r.nombre_rol
    FROM usuarios u
    LEFT JOIN rol r ON u.id_rol = r.id_rol
    WHERE u.nombre_usuario = ${username}
  `.values();

  if (!userWithRoles || userWithRoles.length === 0) {
    await db.end();
    throw createError({
      statusCode: 401,
      message: "Usuario no encontrado",
    });
  }

  const userData = userWithRoles[0];

  if (!verificarContrasena(userData[2], password)) {
    await db.end();
    throw createError({
      statusCode: 401,
      message: "Contraseña incorrecta",
    });
  }

  const rol = userData[6] || "";

  await setUserSession(event, {
    user: {
      id: userData[0],
      nombre_usuario: userData[1],
      nombre_completo: `${userData[3]} ${userData[4]}`,
      correo: userData[5],
      rol,
    },
    loggedInAt: new Date(),
  });

  await db.end();

  return {
    status: "success",
    message: "Login exitoso",
    user: {
      id: userData[0],
      nombre_usuario: userData[1],
      nombre_completo: `${userData[3]} ${userData[4]}`,
      correo: userData[5],
      rol,
    },
  };
});
