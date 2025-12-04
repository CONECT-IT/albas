export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { id_contrato, direccion, descripcion, medidas, servicios_basicos, precio_negociable, partida_registral } = body;

  if (!id_contrato) {
    throw createError({ statusCode: 400, message: "id_contrato es requerido" });
  }

  const propiedad = await contratoService.actualizarPropiedad(user.id, id_contrato, {
    direccion,
    descripcion,
    medidas,
    servicios_basicos,
    precio_negociable,
    partida_registral,
  });

  return { status: "success", message: "Propiedad actualizada", data: propiedad };
});
