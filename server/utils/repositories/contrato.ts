export const contratoRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`
      SELECT c.id_contrato, c.fecha_emision, c.id_propiedad, c.id_persona,
             p.direccion, per.nombre as vendedor_nombre
      FROM contrato c
      INNER JOIN propiedad p ON c.id_propiedad = p.id_propiedad
      INNER JOIN personas per ON c.id_persona = per.id_persona
    `;
  },

  async findById(id: number) {
    const db = usePostgres();
    const [contrato] = await db`
      SELECT c.id_contrato, c.fecha_emision, c.id_propiedad, c.id_persona,
             p.direccion, per.nombre as vendedor_nombre
      FROM contrato c
      INNER JOIN propiedad p ON c.id_propiedad = p.id_propiedad
      INNER JOIN personas per ON c.id_persona = per.id_persona
      WHERE c.id_contrato = ${id}
    `;
    return contrato ?? null;
  },

  async findByPropiedad(idPropiedad: number) {
    const db = usePostgres();
    const [contrato] = await db`
      SELECT c.*, per.nombre as vendedor_nombre
      FROM contrato c
      INNER JOIN personas per ON c.id_persona = per.id_persona
      WHERE c.id_propiedad = ${idPropiedad}
    `;
    return contrato ?? null;
  },

  async findByVendedor(idPersona: number) {
    const db = usePostgres();
    return await db`
      SELECT c.*, p.direccion
      FROM contrato c
      INNER JOIN propiedad p ON c.id_propiedad = p.id_propiedad
      WHERE c.id_persona = ${idPersona}
    `;
  },

  async create(data: { id_propiedad: number; id_persona: number; fecha_emision?: string }) {
    const db = usePostgres();
    const [contrato] = await db`
      INSERT INTO contrato (id_propiedad, id_persona, fecha_emision)
      VALUES (${data.id_propiedad}, ${data.id_persona}, ${data.fecha_emision ?? db`CURRENT_DATE`})
      RETURNING *
    `;
    return contrato;
  },

  async delete(id: number) {
    const db = usePostgres();
    const result = await db`DELETE FROM contrato WHERE id_contrato = ${id}`;
    return result.count > 0;
  },
};
