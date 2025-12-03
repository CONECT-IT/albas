export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { id_persona, direccion, descripcion, medidas, servicios_basicos, precio_negociable, partida_registral } = body;

  if (!id_persona || !direccion || !precio_negociable) {
    throw createError({ statusCode: 400, message: "id_persona, direccion y precio_negociable son requeridos" });
  }

  const resultado = await contratoService.registrar({
    id_usuario: user.id,
    id_persona,
    propiedad: {
      direccion,
      descripcion,
      medidas,
      servicios_basicos,
      precio_negociable,
      partida_registral,
    },
  });

  return { status: "success", message: "Contrato y propiedad registrados", data: resultado };
});
