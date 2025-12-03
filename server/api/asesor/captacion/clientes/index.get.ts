export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const clientes = await captacionService.listarClientes(user.id);
  return { status: "success", data: clientes };
});
