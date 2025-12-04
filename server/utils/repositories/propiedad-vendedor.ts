export const propiedadVendedorRepository = {
  async findByPersona(personaId: number) {
    const db = usePostgres();
    return await db`
      SELECT pv.*, p.direccion, p.descripcion, p.medidas, p.servicios_basicos, p.precio_negociable, p.partida_registral
      FROM propiedad_vendedor pv
      INNER JOIN propiedad p ON pv.id_propiedad = p.id_propiedad
      WHERE pv.id_persona = ${personaId}
    `;
  },

  async findByUsuario(usuarioId: number) {
    const db = usePostgres();
    return await db`
      SELECT pv.*, p.direccion, p.descripcion, p.medidas, p.servicios_basicos, p.precio_negociable, p.partida_registral,
             per.nombre as persona_nombre
      FROM propiedad_vendedor pv
      INNER JOIN propiedad p ON pv.id_propiedad = p.id_propiedad
      INNER JOIN personas per ON pv.id_persona = per.id_persona
      WHERE pv.id_usuario = ${usuarioId}
    `;
  },

  async findOne(propiedadId: number, personaId: number) {
    const db = usePostgres();
    const [result] = await db`
      SELECT pv.*, p.direccion, p.descripcion, p.medidas, p.servicios_basicos, p.precio_negociable, p.partida_registral
      FROM propiedad_vendedor pv
      INNER JOIN propiedad p ON pv.id_propiedad = p.id_propiedad
      WHERE pv.id_propiedad = ${propiedadId} AND pv.id_persona = ${personaId}
    `;
    return result ?? null;
  },

  async create(data: {
    id_propiedad: number;
    id_persona: number;
    id_usuario: number;
    observacion?: string;
  }) {
    const db = usePostgres();
    const [result] = await db`
      INSERT INTO propiedad_vendedor (id_propiedad, id_persona, id_usuario, observacion)
      VALUES (${data.id_propiedad}, ${data.id_persona}, ${data.id_usuario}, ${data.observacion ?? null})
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    return result ?? null;
  },

  async update(propiedadId: number, personaId: number, data: { observacion?: string }) {
    const db = usePostgres();
    const [result] = await db`
      UPDATE propiedad_vendedor SET observacion = ${data.observacion ?? null}
      WHERE id_propiedad = ${propiedadId} AND id_persona = ${personaId}
      RETURNING *
    `;
    return result ?? null;
  },

  async delete(propiedadId: number, personaId: number) {
    const db = usePostgres();
    const result = await db`
      DELETE FROM propiedad_vendedor
      WHERE id_propiedad = ${propiedadId} AND id_persona = ${personaId}
    `;
    return result.count > 0;
  },
};
