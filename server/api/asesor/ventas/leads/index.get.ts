export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const leads = await ventasService.listarLeads(user.id);
  return { status: "success", data: leads };
});
