export const categoriaRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`SELECT id_categoria, nombre_categoria FROM categoria`;
  },

  async findById(id: number) {
    const db = usePostgres();
    const [categoria] = await db`
      SELECT id_categoria, nombre_categoria
      FROM categoria
      WHERE id_categoria = ${id}
    `;
    return categoria ?? null;
  },

  async findByNombre(nombre: string) {
    const db = usePostgres();
    const [categoria] = await db`
      SELECT id_categoria, nombre_categoria
      FROM categoria
      WHERE nombre_categoria = ${nombre}
    `;
    return categoria ?? null;
  },

  async getCategoriasPersona(idPersona: number) {
    const db = usePostgres();
    return await db`
      SELECT c.id_categoria, c.nombre_categoria
      FROM categoria c
      INNER JOIN categoria_persona cp ON c.id_categoria = cp.id_categoria
      WHERE cp.id_persona = ${idPersona}
    `;
  },

  async asignarCategoria(idPersona: number, idCategoria: number) {
    const db = usePostgres();
    const [result] = await db`
      INSERT INTO categoria_persona (id_persona, id_categoria)
      VALUES (${idPersona}, ${idCategoria})
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    return result ?? null;
  },

  async removerCategoria(idPersona: number, idCategoria: number) {
    const db = usePostgres();
    const result = await db`
      DELETE FROM categoria_persona
      WHERE id_persona = ${idPersona} AND id_categoria = ${idCategoria}
    `;
    return result.count > 0;
  },
};
