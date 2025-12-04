export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Usuario y contraseña son requeridos",
    });
  }

  const userData = await authService.login(username, password);

  await setUserSession(event, {
    user: {
      id: userData.id,
      nombre_usuario: userData.username,
      nombre_completo: userData.name,
      rol: userData.rol,
    },
    loggedInAt: new Date(),
  });

  return {
    status: "success",
    message: "Login exitoso",
    user: {
      id: userData.id,
      nombre_usuario: userData.username,
      nombre_completo: userData.name,
      rol: userData.rol,
    },
  };
});
