export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, message: "ID inválido" });
  }

  const asesor = await asesorService.obtener(id);

  return { status: "success", data: asesor };
});
