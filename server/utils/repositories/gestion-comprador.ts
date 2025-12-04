export const gestionCompradorRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`
      SELECT uc.*, p.nombre, p.celular, p.tipo, u.nombres as asesor_nombre
      FROM usuario_comprador uc
      INNER JOIN personas p ON uc.id_persona = p.id_persona
      INNER JOIN usuarios u ON uc.id_usuario = u.id_usuario
    `;
  },

  async findByAsesor(usuarioId: number) {
    const db = usePostgres();
    return await db`
      SELECT uc.*, p.nombre, p.celular, p.tipo, p.fecha_captacion
      FROM usuario_comprador uc
      INNER JOIN personas p ON uc.id_persona = p.id_persona
      WHERE uc.id_usuario = ${usuarioId}
    `;
  },

  async findByPersona(personaId: number) {
    const db = usePostgres();
    return await db`
      SELECT uc.*, u.nombres as asesor_nombre
      FROM usuario_comprador uc
      INNER JOIN usuarios u ON uc.id_usuario = u.id_usuario
      WHERE uc.id_persona = ${personaId}
    `;
  },

  async findOne(usuarioId: number, personaId: number) {
    const db = usePostgres();
    const [gestion] = await db`
      SELECT uc.*, p.nombre, p.celular, p.tipo, p.fecha_captacion
      FROM usuario_comprador uc
      INNER JOIN personas p ON uc.id_persona = p.id_persona
      WHERE uc.id_usuario = ${usuarioId} AND uc.id_persona = ${personaId}
    `;
    return gestion ?? null;
  },

  async create(data: {
    id_usuario: number;
    id_persona: number;
    estado_comprador?: string;
    observacion?: string;
  }) {
    const db = usePostgres();
    const [gestion] = await db`
      INSERT INTO usuario_comprador (id_usuario, id_persona, estado_comprador, observacion)
      VALUES (${data.id_usuario}, ${data.id_persona}, ${data.estado_comprador ?? "Aún no se ha contactado"}, ${data.observacion ?? null})
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    return gestion ?? null;
  },

  async update(
    usuarioId: number,
    personaId: number,
    data: Partial<{ estado_comprador: string; observacion: string }>,
  ) {
    const db = usePostgres();
    const [gestion] = await db`
      UPDATE usuario_comprador SET ${db(data)}
      WHERE id_usuario = ${usuarioId} AND id_persona = ${personaId}
      RETURNING *
    `;
    return gestion ?? null;
  },

  async delete(usuarioId: number, personaId: number) {
    const db = usePostgres();
    const result = await db`
      DELETE FROM usuario_comprador
      WHERE id_usuario = ${usuarioId} AND id_persona = ${personaId}
    `;
    return result.count > 0;
  },
};
