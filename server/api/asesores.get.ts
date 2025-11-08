// Retorna una lista de asesores desde la base de datos, obteniendo: nombre completo, edad, ciudad y pais, ultima actividad, estado, estadisticas, reporte, fdp
//endpoint: /api/asesores [GET]
import { usePostgres } from "#imports";

export default defineEventHandler(async (event) => {
  const db = usePostgres();
  const asesores = await db`
    SELECT u.id_usuario, u.nombres, u.apellidos
    FROM usuarios u 
    INNER JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
    INNER JOIN roles r ON ur.id_rol = r.id_rol
    WHERE r.nombre_rol = 'ASESOR_VENTAS'
  `.values();

    for (let i = 0; i < asesores.length; i++) {
      const asesor = asesores[i];
      const id_usuario = asesor[0];

      const ultimaInteraccion = await db`
        SELECT i.tipo_interaccion, i.fecha_hora
        FROM interacciones i
        WHERE i.id_usuario_asesor = ${id_usuario}
        ORDER BY i.fecha_hora DESC
        LIMIT 1
      `.values();
      asesor.push(ultimaInteraccion.length > 0 ? ultimaInteraccion[0] : null);
    }
  await db.end();


  return {
    status: "success",
    message: "Asesores retornados correctamente",
    data: asesores
  };
});