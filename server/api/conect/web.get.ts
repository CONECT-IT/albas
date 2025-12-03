import { getQuery, setResponseStatus, setResponseHeader } from "h3";

let VERIFY_TOKEN = "123456";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const mode = query["hub.mode"];
  const challenge = query["hub.challenge"];
  const token = query["hub.verify_token"];

  /* Aceptar conexión si conoce el token de verificación y esta en modo de subscipción */
  if (mode === "subscribe" && VERIFY_TOKEN == token) {
    console.log("Webhook verified");
    setResponseStatus(event, 200);
    setResponseHeader(event, "Content-Type", "text/plain");
    return challenge;
  } else {
    setResponseStatus(event, 400);
    return {
      message: "Verification failed. Tokens do not match or mode is not supported.",
    };
  }
});
