import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  const db = usePostgres();
  try {
    const res = await db`
      SELECT 1;
       `.values();

    return {
      status: "success",
      message: "Información del usuario retornada correctamente",
      data: {
        response: res,
      },
    };
  } catch (error) {
    console.error("[ERROR] Error de query:", error.message || error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  } finally {
    await db.end();
  }
});
