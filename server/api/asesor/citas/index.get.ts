export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const citas = await citasService.listarPorAsesor(user.id);
  return { status: "success", data: citas };
});
