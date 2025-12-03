export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, message: "ID inválido" });
  }

  await asesorService.eliminar(id);

  return { status: "success", message: "Asesor eliminado" };
});
