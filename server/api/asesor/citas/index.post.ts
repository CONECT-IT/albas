export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { fecha_agendada, id_persona, observacion } = body;

  if (!fecha_agendada || !id_persona) {
    throw createError({ statusCode: 400, message: "fecha_agendada e id_persona son requeridos" });
  }

  const cita = await citasService.agendar({
    fecha_agendada,
    id_persona,
    id_usuario: user.id,
    observacion,
  });

  return { status: "success", message: "Cita agendada", data: cita };
});
