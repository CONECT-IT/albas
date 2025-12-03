import { usePostgres } from "#imports";
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const bodyJson = JSON.stringify(body);
  console.log(bodyJson);

  console.log("POST /web - mode:");

  const number = body;
  console.log(number);
  console.log(number["entry"][0]["changes"][0]);
  
  return "Webhook processed";
  // Escribir criterios de asignacion de asesor
});
