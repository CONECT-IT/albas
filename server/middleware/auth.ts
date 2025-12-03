export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const path = event.path;

  if (session?.user) {
    event.context.user = session.user;
  }

  if (path.startsWith("/api/admin")) {
    if (!session?.user) {
      throw createError({ statusCode: 401, message: "No autenticado" });
    }
    if (session.user.rol !== "Administrador") {
      throw createError({ statusCode: 403, message: "No autorizado" });
    }
  }

  if (path.startsWith("/api/asesor")) {
    if (!session?.user) {
      throw createError({ statusCode: 401, message: "No autenticado" });
    }
    if (session.user.rol !== "Asesor") {
      throw createError({ statusCode: 403, message: "No autorizado" });
    }
  }
});
