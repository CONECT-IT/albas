export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const contratos = await contratoService.listar(user.id);
  return { status: "success", data: contratos };
});
