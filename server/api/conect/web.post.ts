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

    const personaRepetida = await captacionService.leadRepetido(waPhoneNumber);
    const esRepetido = personaRepetida.esRepetido;
    if (esRepetido) {
      const { persona } = personaRepetida;
      const id_persona = persona.id_persona;

      const leadRepetido = await captacionService.leadActivo(id_persona);
      const esActivo = leadRepetido.esActivo;
      if (esActivo) {
        setResponseStatus(event, 209);
        message = {
          message: "No se asignó, el lead ya existe y está en atencion activa.",
        };
      } else {
        if (leadRepetido.lead?.length === 0) {
          setResponseStatus(event, 200);
          const asesorElegido = await elegirAsesorAutomaticamente();
          await gestionVendedorRepository.create({
            id_usuario: Number(asesorElegido),
            id_persona: id_persona,
            observacion: "Lead asignado automáticamente por el sistema",
          });
          return {
            message: "El lead existe pero no tiene gestiones previas, se creo una, completado.",
          };
        }
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
      /* Asignar al asesor con menor carga */
      const asesores = await asesorService.cargaAsesores();

      const asesorMenorCarga = asesores.reduce((prev: any, curr: any) => {
        return prev.total_clientes < curr.total_clientes ? prev : curr;
      });
      const asesoresConMenorCarga = asesores.filter(
        (a: any) => a.total_clientes === asesorMenorCarga.total_clientes,
      );

      /* Ante empate de asesores, escoger al asesor con mejor rendimiento (conversion de clientes) */
      if (asesoresConMenorCarga.length > 1) {
        const rendimientoPromises = asesoresConMenorCarga.map(async (asesor) => {
          const r = await asesorService.rendimientoAsesor(Number(asesor.id_usuario));
          const rendimiento = typeof r === "number" ? r : 0;
          return { id_usuario: Number(asesor.id_usuario), rendimiento };
        });

        const asesoresConRendimiento = await Promise.all(rendimientoPromises);
        const asesorMejorRendimiento = asesoresConRendimiento.reduce((prev: any, curr: any) => {
          return prev.rendimiento > curr.rendimiento ? prev : curr;
        });
        const asesorAsignado = asesorMejorRendimiento.id_usuario;
        const tipoLead: "Lead Alvas" | "Lead Propio" = "Lead Alvas";
        const nuevoLead = {
          nombre: waName,
          celular: waPhoneNumber,
          tipo: tipoLead,
          id_usuario: Number(asesorAsignado),
          observacion: "Lead asignado automáticamente por el sistema",
        };
        await captacionService.registrarLead(nuevoLead);
        message = {
          message: "Lead registrado exitosamente al asesor con mejor rendimiento.",
        };
      } else {
        const asesorAsignado = asesoresConMenorCarga[0].id_usuario;

        const tipoLead: "Lead Alvas" | "Lead Propio" = "Lead Alvas";
        const nuevoLead = {
          nombre: waName,
          celular: waPhoneNumber,
          tipo: tipoLead,
          id_usuario: Number(asesorAsignado),
          observacion: "Lead asignado automáticamente por el sistema",
        };
        await captacionService.registrarLead(nuevoLead);
        message = {
          message: "Lead registrado exitosamente al asesor con menor carga.",
        };
      }
    }
  } catch (error) {
    setResponseStatus(event, 500);
    message = { message: "Error durante las comprobaciones de asignación", error };
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

async function elegirAsesorAutomaticamente() {
  /* Asignar al asesor con menor carga */
  const asesores = await asesorService.cargaAsesores();

  const asesorMenorCarga = asesores.reduce((prev: any, curr: any) => {
    return prev.total_clientes < curr.total_clientes ? prev : curr;
  });
  const asesoresConMenorCarga = asesores.filter(
    (a: any) => a.total_clientes === asesorMenorCarga.total_clientes,
  );

  /* Ante empate de asesores, escoger al asesor con mejor rendimiento (conversion de clientes) */
  if (asesoresConMenorCarga.length > 1) {
    const rendimientoPromises = asesoresConMenorCarga.map(async (asesor) => {
      const r = await asesorService.rendimientoAsesor(Number(asesor.id_usuario));
      const rendimiento = typeof r === "number" ? r : 0;
      return { id_usuario: Number(asesor.id_usuario), rendimiento };
    });

    const asesoresConRendimiento = await Promise.all(rendimientoPromises);
    const asesorMejorRendimiento = asesoresConRendimiento.reduce((prev: any, curr: any) => {
      return prev.rendimiento > curr.rendimiento ? prev : curr;
    });
    const asesorAsignado = asesorMejorRendimiento.id_usuario;
    return asesorAsignado;
  } else {
    const asesorAsignado = asesoresConMenorCarga[0].id_usuario;
    return asesorAsignado;
  }
}
