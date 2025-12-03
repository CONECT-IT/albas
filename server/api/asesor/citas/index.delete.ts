export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id_cita } = body;

  if (!id_cita) {
    throw createError({ statusCode: 400, message: "id_cita es requerido" });
  }

  const deleted = await citasService.eliminar(id_cita);

  if (!deleted) {
    throw createError({ statusCode: 404, message: "Cita no encontrada" });
  }

  return { status: "success", message: "Cita eliminada" };
});
