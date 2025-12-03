export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const { nombre, celular, observacion } = body;

  if (!nombre) {
    throw createError({ statusCode: 400, message: "Nombre es requerido" });
  }

  const cliente = await captacionService.registrarCliente({
    nombre,
    celular,
    id_usuario: user.id,
    observacion,
  });

  return { status: "success", message: "Cliente creado", data: cliente };
});
