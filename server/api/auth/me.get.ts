export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: "No autenticado",
    });
  }

  const profile = await authService.getProfile(session.user.id);

  return {
    status: "success",
    user: {
      id: profile.id_usuario,
      nombre_usuario: profile.nombre_usuario,
      nombre_completo: `${profile.nombres} ${profile.apellidos}`,
      correo: profile.correo,
      rol: profile.nombre_rol,
    },
    loggedInAt: session.loggedInAt,
  };
});
