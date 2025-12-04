export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const {
    id_persona,
    direccion,
    descripcion,
    medidas,
    servicios_basicos,
    precio_negociable,
    partida_registral,
    observacion,
  } = body;

  if (!id_persona || !direccion || precio_negociable === undefined) {
    throw createError({
      statusCode: 400,
      message: "id_persona, direccion y precio_negociable son requeridos",
    });
  }

  const propiedad = await propiedadVendedorService.crearPropiedadYAsignar({
    id_persona,
    id_usuario: user.id,
    direccion,
    descripcion,
    medidas,
    servicios_basicos,
    precio_negociable,
    partida_registral,
    observacion,
  });

  return { status: "success", message: "Propiedad creada y asignada", data: propiedad };
});
