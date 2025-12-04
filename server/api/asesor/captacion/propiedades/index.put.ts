export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    id_propiedad,
    direccion,
    descripcion,
    medidas,
    servicios_basicos,
    precio_negociable,
    partida_registral,
  } = body;

  if (!id_propiedad) {
    throw createError({ statusCode: 400, message: "id_propiedad es requerido" });
  }

  const updateData: Record<string, any> = {};
  if (direccion !== undefined) updateData.direccion = direccion;
  if (descripcion !== undefined) updateData.descripcion = descripcion;
  if (medidas !== undefined) updateData.medidas = medidas;
  if (servicios_basicos !== undefined) updateData.servicios_basicos = servicios_basicos;
  if (precio_negociable !== undefined) updateData.precio_negociable = precio_negociable;
  if (partida_registral !== undefined) updateData.partida_registral = partida_registral;

  const propiedad = await propiedadVendedorService.actualizar(id_propiedad, updateData);

  if (!propiedad) {
    throw createError({ statusCode: 404, message: "Propiedad no encontrada" });
  }

  return { status: "success", message: "Propiedad actualizada", data: propiedad };
});
