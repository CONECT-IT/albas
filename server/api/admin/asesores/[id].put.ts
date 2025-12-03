export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, message: "ID inválido" });
  }

  const body = await readBody(event);
  const { nombre_usuario, correo, nombres, apellidos } = body;

  const data: Record<string, unknown> = {};
  if (nombre_usuario) data.nombre_usuario = nombre_usuario;
  if (correo) data.correo = correo;
  if (nombres) data.nombres = nombres;
  if (apellidos) data.apellidos = apellidos;

  if (Object.keys(data).length === 0) {
    throw createError({ statusCode: 400, message: "No hay datos para actualizar" });
  }

  const asesor = await asesorService.actualizar(id, data);

  return { status: "success", message: "Asesor actualizado", data: asesor };
});
