import { usePostgres } from "#imports";
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  //   const user = event.context.user;

  //   const body = await readBody(event);
  //   console.log(JSON.stringify(body));
  const query = getQuery(event);
  const mode = query["hub.mode"];
  const challenge = query["hub.challenge"];
  const token = query["hub.verify_token"];

  console.log("GET /webhook - mode:", mode, "token:", token);

  if (mode === "subscribe") {
    console.log("✓ Webhook verified successfully!");
    const res = challenge;
    return res;
  } else {
    return {
      status: 400,
      message: "no funciono",
    };
  }

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
