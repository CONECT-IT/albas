import { usePostgres } from "#imports";
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
  
  try {

    const { waName, waPhone } = getWhatsappInfo(body);
    const waPhoneNumber = waPhone.slice(2, -1);

    console.log("Mensaje recibido con exito!");
    console.log("El numero es: ", waPhoneNumber, " y el nombre es: ", waName);

    const personaRepetida = await captacionService.leadRepetido(waPhone);
    const esRepetido = personaRepetida.esRepetido;

    if (esRepetido) {
      const persona = personaRepetida.persona;
      const id_persona = persona.id_persona;
      const leadRepetido = await captacionService.leadActivo(id_persona);
      const esActivo = leadRepetido.esActivo;

      if (esActivo) {
        setResponseStatus(event, 409);
        setResponseHeader(
          event,
          "message",
          "No se asignó, el lead ya existe y está en atencion activa.",
        );
      } else {
        const asesor = leadRepetido.lead[0].id_usuario;
        const tipoLead: "Lead Alvas" | "Lead Propio" = "Lead Alvas";
        const nuevoLead = {
          nombre: persona.nombre,
          celular: waPhoneNumber,
          tipo: tipoLead,
          id_usuario: Number(asesor),
          observacion: "Lead asignado automáticamente por el sistema",
        };
        await captacionService.registrarLead(nuevoLead);
      }
    } else {
      console.log("El lead con numero ", waPhone, " es nuevo y puede ser registrado.");
    }
  } catch (error) {
  } finally {
  }
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
