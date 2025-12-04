export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id_cita, fecha_agendada, estado_visita_guiada, observacion } = body;

  if (!id_cita) {
    throw createError({ statusCode: 400, message: "id_cita es requerido" });
  }

  let cita;
  if (fecha_agendada) {
    cita = await citasService.reprogramar(id_cita, fecha_agendada, observacion);
  } else if (estado_visita_guiada) {
    cita = await citasService.actualizarEstado(id_cita, estado_visita_guiada, observacion);
  } else {
    throw createError({ statusCode: 400, message: "Debe enviar fecha_agendada o estado_visita_guiada" });
  }

  return { status: "success", message: "Cita actualizada", data: cita };
});
