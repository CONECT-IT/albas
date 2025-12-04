export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const query = getQuery(event);
  const id_persona = query.id_persona ? Number(query.id_persona) : null;

  if (id_persona) {
    const propiedades = await propiedadVendedorService.listarPorPersona(id_persona);
    return { status: "success", data: propiedades };
  }

  const propiedades = await propiedadVendedorService.listarPorUsuario(user.id);
  return { status: "success", data: propiedades };
});
