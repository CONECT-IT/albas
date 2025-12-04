export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "No autenticado" });
  }

  const body = await readBody(event);
  const { id_persona } = body;

  if (!id_persona) {
    throw createError({ statusCode: 400, message: "id_persona es requerido" });
  }

  const resultado = await conversionService.convertir({
    id_persona,
    id_usuario: user.id,
    tipo_nuevo: "Cliente",
  });

  return {
    status: "success",
    message: "Conversión registrada",
    data: resultado,
  };
});
