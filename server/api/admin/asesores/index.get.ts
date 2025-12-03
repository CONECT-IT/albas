export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const asesores = await asesorService.listarConStats(user.id);

  return { status: "success", data: asesores };
});
