export const requireAuth = () => {
  return defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    const user = session?.user;

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "No autenticado",
      });
    }

    event.context.user = user;

    return { user };
  });
};

export const requireRole = (roles: string[]) => {
  return defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    const user = session?.user;

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "No autenticado",
      });
    }

    const hasRequiredRole = user.roles.some((userRole) =>
      roles.some((requiredRole) => userRole.toLowerCase() === requiredRole.toLowerCase()),
    );

    if (!hasRequiredRole) {
      throw createError({
        statusCode: 403,
        message: "Acceso denegado. Rol insuficiente",
      });
    }

    return { user, hasRequiredRole };
  });
};
