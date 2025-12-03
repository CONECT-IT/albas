export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { id_persona } = body;

  if (!id_persona) {
    throw createError({ statusCode: 400, message: "id_persona es requerido" });
  }

  const deleted = await ventasService.eliminarGestion(user.id, id_persona);

  if (!deleted) {
    throw createError({ statusCode: 404, message: "Lead no encontrado" });
  }

  return { status: "success", message: "Lead eliminado de tu gestión" };
});
