export const conversionRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`
      SELECT c.*, p.nombre as persona_nombre, u.nombres as asesor_nombre
      FROM conversiones c
      INNER JOIN personas p ON c.id_persona = p.id_persona
      INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
      ORDER BY c.fecha_conversion DESC
    `;
  },

  async findByPersona(personaId: number) {
    const db = usePostgres();
    return await db`
      SELECT c.*, u.nombres as asesor_nombre
      FROM conversiones c
      INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_persona = ${personaId}
      ORDER BY c.fecha_conversion DESC
    `;
  },

  async findByAsesor(usuarioId: number) {
    const db = usePostgres();
    return await db`
      SELECT c.*, p.nombre as persona_nombre
      FROM conversiones c
      INNER JOIN personas p ON c.id_persona = p.id_persona
      WHERE c.id_usuario = ${usuarioId}
      ORDER BY c.fecha_conversion DESC
    `;
  },

  async create(data: { id_persona: number; id_usuario: number; tipo_anterior: string; tipo_nuevo: string }) {
    const db = usePostgres();
    const [conversion] = await db`
      INSERT INTO conversiones (id_persona, id_usuario, tipo_anterior, tipo_nuevo)
      VALUES (${data.id_persona}, ${data.id_usuario}, ${data.tipo_anterior}, ${data.tipo_nuevo})
      RETURNING *
    `;
    return conversion;
  },
};
