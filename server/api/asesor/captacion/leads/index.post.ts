export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { nombre, celular, tipo, observacion } = body;

  if (!nombre || !tipo) {
    throw createError({ statusCode: 400, message: "Nombre y tipo son requeridos" });
  }

  const tiposValidos = ["Lead Alvas", "Lead Propio", "Referido"];
  if (!tiposValidos.includes(tipo)) {
    throw createError({
      statusCode: 400,
      message: "Tipo debe ser 'Lead Alvas', 'Lead Propio' o 'Referido'",
    });
  }

  const lead = await captacionService.registrarLead({
    nombre,
    celular,
    tipo,
    id_usuario: user.id,
    observacion,
  });

  return { status: "success", message: "Lead creado", data: lead };
});
