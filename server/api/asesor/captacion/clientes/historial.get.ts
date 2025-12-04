export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const query = getQuery(event);
  const id_persona = Number(query.id_persona);

  if (!id_persona) {
    throw createError({ statusCode: 400, message: "id_persona es requerido" });
  }

  // Verificar que el asesor tiene acceso a este cliente
  const gestion = await gestionVendedorRepository.findOne(user.id, id_persona);
  if (!gestion) {
    throw createError({ statusCode: 403, message: "No tienes acceso a este cliente" });
  }

  // Obtener citas del cliente
  const citas = await citaRepository.findByPersona(id_persona);

  // Obtener conversiones del cliente
  const conversiones = await conversionRepository.findByPersona(id_persona);

  return {
    status: "success",
    data: {
      citas,
      conversiones,
    },
  };
});
