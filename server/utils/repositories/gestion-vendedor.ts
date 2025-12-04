export const gestionVendedorRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`
      SELECT uv.*, p.nombre, p.celular, p.tipo, u.nombres as asesor_nombre
      FROM usuario_vendedor uv
      INNER JOIN personas p ON uv.id_persona = p.id_persona
      INNER JOIN usuarios u ON uv.id_usuario = u.id_usuario
    `;
  },

  async findByAsesor(usuarioId: number) {
    const db = usePostgres();
    return await db`
      SELECT uv.*, p.nombre, p.celular, p.tipo, p.fecha_captacion
      FROM usuario_vendedor uv
      INNER JOIN personas p ON uv.id_persona = p.id_persona
      WHERE uv.id_usuario = ${usuarioId}
    `;
  },

  async getCargaVentas() {
    const db = usePostgres();
    return await db`
      SELECT u.id_usuario, A.total_clientes
      FROM (
        SELECT uv.id_usuario, COUNT(uv.id_persona) AS total_clientes
        FROM usuario_vendedor uv 
        WHERE uv.estado_vendedor NOT IN ('Cierre', 'No responde')
        GROUP BY uv.id_usuario
      ) as A
      RIGHT JOIN usuarios u ON u.id_usuario = A.id_usuario
      WHERE NOT (u.id_rol = 1)
    `;
  },

  async findByPersona(personaId: number) {
    const db = usePostgres();
    return await db`
      SELECT uv.*, u.nombres as asesor_nombre
      FROM usuario_vendedor uv
      INNER JOIN usuarios u ON uv.id_usuario = u.id_usuario
      WHERE uv.id_persona = ${personaId}
    `;
  },

  async findByPersonaActiva(personaId: number) {
    const db = usePostgres();
    return await db`
      SELECT *
      FROM usuario_vendedor
      WHERE id_persona = ${personaId} AND estado_vendedor NOT IN ('Cierre', 'No responde')
      ORDER BY id_usuario DESC
      LIMIT 1
    `;
  },

  async findOne(usuarioId: number, personaId: number) {
    const db = usePostgres();
    const [gestion] = await db`
      SELECT uv.*, p.nombre, p.celular, p.tipo, p.fecha_captacion
      FROM usuario_vendedor uv
      INNER JOIN personas p ON uv.id_persona = p.id_persona
      WHERE uv.id_usuario = ${usuarioId} AND uv.id_persona = ${personaId}
    `;
    return gestion ?? null;
  },

  async create(data: {
    id_usuario: number;
    id_persona: number;
    estado_vendedor?: string;
    observacion?: string;
  }) {
    const db = usePostgres();
    const [gestion] = await db`
      INSERT INTO usuario_vendedor (id_usuario, id_persona, estado_vendedor, observacion)
      VALUES (${data.id_usuario}, ${data.id_persona}, ${data.estado_vendedor ?? "Seguimiento"}, ${data.observacion ?? null})
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    return gestion ?? null;
  },

  async update(
    usuarioId: number,
    personaId: number,
    data: Partial<{ estado_vendedor: string; observacion: string }>,
  ) {
    const db = usePostgres();
    const [gestion] = await db`
      UPDATE usuario_vendedor SET ${db(data)}
      WHERE id_usuario = ${usuarioId} AND id_persona = ${personaId}
      RETURNING *
    `;
    return gestion ?? null;
  },

  async delete(usuarioId: number, personaId: number) {
    const db = usePostgres();
    const result = await db`
      DELETE FROM usuario_vendedor
      WHERE id_usuario = ${usuarioId} AND id_persona = ${personaId}
    `;
    return result.count > 0;
  },
};
