export const interesadoRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`
      SELECT i.*, p.direccion, per.nombre as comprador_nombre
      FROM interesado i
      INNER JOIN propiedad p ON i.id_propiedad = p.id_propiedad
      INNER JOIN personas per ON i.id_persona = per.id_persona
    `;
  },

  async findByPropiedad(idPropiedad: number) {
    const db = usePostgres();
    return await db`
      SELECT i.*, per.nombre as comprador_nombre, per.celular
      FROM interesado i
      INNER JOIN personas per ON i.id_persona = per.id_persona
      WHERE i.id_propiedad = ${idPropiedad}
    `;
  },

  async findByPersona(idPersona: number) {
    const db = usePostgres();
    return await db`
      SELECT i.*, p.direccion, p.precio_negociable
      FROM interesado i
      INNER JOIN propiedad p ON i.id_propiedad = p.id_propiedad
      WHERE i.id_persona = ${idPersona}
    `;
  },

  async create(data: { id_propiedad: number; id_persona: number }) {
    const db = usePostgres();
    const [interesado] = await db`
      INSERT INTO interesado (id_propiedad, id_persona)
      VALUES (${data.id_propiedad}, ${data.id_persona})
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    return interesado ?? null;
  },

  async update(
    idPropiedad: number,
    idPersona: number,
    data: Partial<{ vendido: boolean; separado: boolean }>,
  ) {
    const db = usePostgres();
    const [interesado] = await db`
      UPDATE interesado SET ${db(data)}
      WHERE id_propiedad = ${idPropiedad} AND id_persona = ${idPersona}
      RETURNING *
    `;
    return interesado ?? null;
  },

  async delete(idPropiedad: number, idPersona: number) {
    const db = usePostgres();
    const result = await db`
      DELETE FROM interesado
      WHERE id_propiedad = ${idPropiedad} AND id_persona = ${idPersona}
    `;
    return result.count > 0;
  },
};
