import { usePostgres } from "#imports";
import { JSONValue } from "postgres";
import { setResponseStatus } from "h3";

interface WhatsappMessage {
  entry: Array<{
    changes: Array<{
      value: {
        contacts: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
      };
    }>;
  }>;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const { waName, waPhone } = getWhatsappInfo(body);
  console.log("Mensaje recibido con exito!");
  console.log("El numero es: ", waPhone, " y el nombre es: ", waName);
  
  /* Escribir criterios de asignacion de asesor */

  setResponseStatus(event, 200);
  return event;
});

function getWhatsappInfo(json: WhatsappMessage) {
    
  /* Extraer la informacion de contacto del receptor */
  const { changes } = json["entry"][0];
  const { value } = changes[0];
  const { contacts } = value;

  /* Extraer el nombre y el numero de telefono */
  const waName = contacts[0]["profile"]["name"];
  const waPhone = contacts[0]["wa_id"];

  return { waName, waPhone };
}
