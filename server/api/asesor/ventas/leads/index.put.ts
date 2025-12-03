export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { id_persona, nombre, celular, estado_comprador, observacion } = body;

  if (!id_persona) {
    throw createError({ statusCode: 400, message: "id_persona es requerido" });
  }

  if (nombre || celular) {
    const personaUpdate: Record<string, string> = {};
    if (nombre) personaUpdate.nombre = nombre;
    if (celular) personaUpdate.celular = celular;
    await ventasService.actualizarPersona(id_persona, personaUpdate);
  }

  if (estado_comprador || observacion) {
    const gestionUpdate: Record<string, string> = {};
    if (estado_comprador) gestionUpdate.estado_comprador = estado_comprador;
    if (observacion) gestionUpdate.observacion = observacion;
    await ventasService.actualizarGestion(user.id, id_persona, gestionUpdate);
  }

  const gestion = await ventasService.obtenerGestion(user.id, id_persona);
  return { status: "success", message: "Lead actualizado", data: gestion };
});
