export const citaRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`
      SELECT c.*, p.nombre as persona_nombre, u.nombres as asesor_nombre
      FROM citas c
      INNER JOIN personas p ON c.id_persona = p.id_persona
      INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
      ORDER BY c.fecha_agendada DESC
    `;
  },

  async findById(id: number) {
    const db = usePostgres();
    const [cita] = await db`
      SELECT c.*, p.nombre as persona_nombre
      FROM citas c
      INNER JOIN personas p ON c.id_persona = p.id_persona
      WHERE c.id_cita = ${id}
    `;
    return cita ?? null;
  },

  async findByAsesor(usuarioId: number) {
    const db = usePostgres();
    return await db`
      SELECT c.*, p.nombre as persona_nombre
      FROM citas c
      INNER JOIN personas p ON c.id_persona = p.id_persona
      WHERE c.id_usuario = ${usuarioId}
      ORDER BY c.fecha_agendada DESC
    `;
  },

  async findByPersona(personaId: number) {
    const db = usePostgres();
    return await db`
      SELECT c.*, u.nombres as asesor_nombre
      FROM citas c
      INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_persona = ${personaId}
      ORDER BY c.fecha_agendada DESC
    `;
  },

  async create(data: {
    fecha_agendada: string;
    observacion?: string;
    estado_visita_guiada: string;
    id_persona: number;
    id_usuario: number;
  }) {
    const db = usePostgres();
    const [cita] = await db`
      INSERT INTO citas (fecha_agendada, observacion, estado_visita_guiada, id_persona, id_usuario)
      VALUES (${data.fecha_agendada}, ${data.observacion ?? null}, ${data.estado_visita_guiada}, ${data.id_persona}, ${data.id_usuario})
      RETURNING *
    `;
    return cita;
  },

  async update(
    id: number,
    data: Partial<{ fecha_agendada: string; observacion: string; estado_visita_guiada: string }>,
  ) {
    const db = usePostgres();
    const [cita] = await db`
      UPDATE citas SET ${db(data)}
      WHERE id_cita = ${id}
      RETURNING *
    `;
    return cita ?? null;
  },

  async delete(id: number) {
    const db = usePostgres();
    const result = await db`DELETE FROM citas WHERE id_cita = ${id}`;
    return result.count > 0;
  },
};
