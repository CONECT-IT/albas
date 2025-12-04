export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { id_contrato } = body;

  if (!id_contrato) {
    throw createError({ statusCode: 400, message: "id_contrato es requerido" });
  }

  await contratoService.eliminar(user.id, id_contrato);

  return { status: "success", message: "Contrato y propiedad eliminados" };
});
