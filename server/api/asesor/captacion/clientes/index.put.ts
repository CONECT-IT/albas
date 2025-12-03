export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { id_persona, nombre, celular, estado_vendedor, observacion } = body;

  if (!id_persona) {
    throw createError({ statusCode: 400, message: "id_persona es requerido" });
  }

  if (nombre || celular) {
    const personaUpdate: Record<string, string> = {};
    if (nombre) personaUpdate.nombre = nombre;
    if (celular) personaUpdate.celular = celular;
    await captacionService.actualizarPersona(id_persona, personaUpdate);
  }

  if (estado_vendedor || observacion) {
    const gestionUpdate: Record<string, string> = {};
    if (estado_vendedor) gestionUpdate.estado_vendedor = estado_vendedor;
    if (observacion) gestionUpdate.observacion = observacion;
    await captacionService.actualizarGestion(user.id, id_persona, gestionUpdate);
  }

  const gestion = await captacionService.obtenerGestion(user.id, id_persona);
  return { status: "success", message: "Cliente actualizado", data: gestion };
});
