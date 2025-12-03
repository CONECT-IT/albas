export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const clientes = await ventasService.listarClientes(user.id);
  return { status: "success", data: clientes };
});
