export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { nombre, celular, tipo, observacion } = body;

  if (!nombre || !tipo) {
    throw createError({ statusCode: 400, message: "Nombre y tipo son requeridos" });
  }

  if (tipo !== "Lead Alvas" && tipo !== "Lead Propio") {
    throw createError({ statusCode: 400, message: "Tipo debe ser 'Lead Alvas' o 'Lead Propio'" });
  }

  const lead = await ventasService.registrarLead({
    nombre,
    celular,
    tipo,
    id_usuario: user.id,
    observacion,
  });

  return { status: "success", message: "Lead creado", data: lead };
});
