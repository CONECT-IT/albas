import { usePostgres } from "#imports";
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);
  const bodyJson = JSON.stringify(body);
  console.log(bodyJson);

  console.log("POST /web - mode:");

  const number = body[0];
  console.log(number);
  return 1;
  // Escribir criterios de asignacion de asesor
});
