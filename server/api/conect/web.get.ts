import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {

  const user = event.context.user;

  const db = usePostgres();

  const body = await readBody(event);
  console.log(JSON.stringify(body));

  /*try {
    
  } catch (error) {
    console.error("[ERROR] Error obteniendo leads:", error);
    throw createError({
      statusCode: 500,
      message: "Error interno del servidor",
    });
  } finally {
    await db.end();
  }*/
});
