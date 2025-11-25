import { requireRole } from "../../utils/auth";
import { userRepo } from "#shared/services/user-repository";

export default defineEventHandler(async (event) => {
  await requireRole(["Administrador", "admin", "administrador/a"])(event);

  try {
    const asesores = await userRepo.findByRole("Asesor");
    return {
      status: "success",
      message: "Asesores retornados correctamente",
      data: asesores,
    };
  } catch (error) {
    console.error("[ERROR] Error obteniendo asesores:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  }
});
