export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "No autenticado" });
  }

  const body = await readBody(event);
  const { id_persona, nombre, celular, estado_vendedor, observacion } = body;

  if (!id_persona) {
    throw createError({ statusCode: 400, message: "id_persona es requerido" });
  }

  if (nombre || celular || body.tipo) {
    const personaUpdate: Record<string, string> = {};
    if (nombre) personaUpdate.nombre = nombre;
    if (celular) personaUpdate.celular = celular;
    if (body.tipo) personaUpdate.tipo = body.tipo;
    await captacionService.actualizarPersona(user.id, id_persona, personaUpdate);
  }

  if (estado_vendedor || observacion) {
    const gestionUpdate: Record<string, string> = {};
    if (estado_vendedor) gestionUpdate.estado_vendedor = estado_vendedor;
    if (observacion) gestionUpdate.observacion = observacion;
    await captacionService.actualizarGestion(user.id, id_persona, gestionUpdate);
  }

  const gestion = await captacionService.obtenerGestion(user.id, id_persona);
  return { status: "success", message: "Lead actualizado", data: gestion };
});
