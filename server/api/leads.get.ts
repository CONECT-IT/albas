// Retorna una lista de leads desde la base de datos, obteniendo: nombre completo, edad, pais y ciudad, ultima actividad, estado, estadisticas, fdp
//endpoint: /api/leads [GET]
import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {

  const db = usePostgres();
  const leads = await db`
    select l.id_persona, p.nombre, le.nombre_estado
    from leads l
    inner join lead_estados le on l.id_estado = le.id_estado
    inner join personas p on l.id_persona = p.id_persona
    `.values();
    for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];
        const id_persona = lead[0];
        const ultimaInteraccion = await db`
        select i.tipo_interaccion, i.fecha_hora
        from interacciones i
        where i.id_persona_lead = ${id_persona}
        order by i.fecha_hora desc
        limit 1
        `.values();
        lead.push(ultimaInteraccion.length > 0 ? ultimaInteraccion[0] : null);
    }
    await db.end();
    return {
    status: "success",
    message: "Leads retornados correctamente",
    data: leads
  };
});