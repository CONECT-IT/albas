export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id_propiedad, id_persona } = body;

  if (!id_propiedad || !id_persona) {
    throw createError({ statusCode: 400, message: "id_propiedad e id_persona son requeridos" });
  }

  const deleted = await propiedadVendedorService.eliminar(id_propiedad, id_persona);

  if (!deleted) {
    throw createError({ statusCode: 404, message: "Relación propiedad-vendedor no encontrada" });
  }

  return { status: "success", message: "Propiedad desasignada del vendedor" };
});
