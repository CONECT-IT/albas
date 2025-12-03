export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const body = await readBody(event);
  const { nombre_usuario, contrasena, correo, nombres, apellidos } = body;

  if (!nombre_usuario || !contrasena || !correo || !nombres || !apellidos) {
    throw createError({ statusCode: 400, message: "Faltan campos requeridos" });
  }

  const asesor = await asesorService.crear({
    nombre_usuario,
    contrasena,
    correo,
    nombres,
    apellidos,
    supervisor_id: user.id,
  });

  return { status: "success", message: "Asesor creado", data: asesor };
});
