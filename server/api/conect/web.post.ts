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
  let message = {};
  try {
    const { waName, waPhone } = getWhatsappInfo(body);
    const waPhoneNumber = waPhone.slice(2, waPhone.length);

    console.log("Mensaje recibido con exito!");
    console.log("El numero es: ", waPhoneNumber, " y el nombre es: ", waName);

    const personaRepetida = await captacionService.leadRepetido(waPhoneNumber);
    const esRepetido = personaRepetida.esRepetido;

    if (esRepetido) {
      const { persona } = personaRepetida;
      const id_persona = persona.id_persona;

      const leadRepetido = await captacionService.leadActivo(id_persona);
      const esActivo = leadRepetido.esActivo;

      if (esActivo) {
        setResponseStatus(event, 409);
        message = {
          message: "No se asignó, el lead ya existe y está en atencion activa.",
        };
      } else {
        const asesorAnterior = leadRepetido.lead?.[0].id_usuario;

        const tipoLead: "Lead Alvas" | "Lead Propio" = "Lead Alvas";
        const nuevoLead = {
          nombre: persona.nombre,
          celular: waPhoneNumber,
          tipo: tipoLead,
          id_usuario: Number(asesorAnterior),
          observacion: "Lead asignado automáticamente por el sistema",
        };
        await captacionService.registrarLead(nuevoLead);
        message = {
          message: "Lead registrado exitosamente al mismo asesor.",
        };
      }
    } else {
      message = "si paso";
    }
  } catch (error) {
    message = { message: "algo paso", error };
  }

  return message;
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
