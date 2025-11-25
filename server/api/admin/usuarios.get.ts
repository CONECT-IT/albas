import { requireRole } from "../../utils/auth";
import { userRepo } from "#shared/services/user-repository";

export default defineEventHandler(async (event) => {
  await requireRole(["Administrador", "admin", "administrador/a"])(event);

  try {
    const allUsers = await userRepo.findAll();
    return {
      status: "success",
      message: "Usuarios retornados correctamente",
      data: allUsers,
    };
  } catch (error) {
    console.error("[ERROR] Error obteniendo usuarios:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  }
});
