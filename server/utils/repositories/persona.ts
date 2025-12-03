export const personaRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`
      SELECT id_persona, nombre, celular, tipo, fecha_captacion
      FROM personas
    `;
  },

  async findById(id: number) {
    const db = usePostgres();
    const [persona] = await db`
      SELECT id_persona, nombre, celular, tipo, fecha_captacion
      FROM personas
      WHERE id_persona = ${id}
    `;
    return persona ?? null;
  },

  async findByTipo(tipo: string) {
    const db = usePostgres();
    return await db`
      SELECT id_persona, nombre, celular, tipo, fecha_captacion
      FROM personas
      WHERE tipo = ${tipo}
    `;
  },

  async findLeads() {
    const db = usePostgres();
    return await db`
      SELECT id_persona, nombre, celular, tipo, fecha_captacion
      FROM personas
      WHERE tipo IN ('Lead Alvas', 'Lead Propio')
    `;
  },

  async findClientes() {
    const db = usePostgres();
    return await db`
      SELECT id_persona, nombre, celular, tipo, fecha_captacion
      FROM personas
      WHERE tipo = 'Cliente'
    `;
  },

  async findReferidos() {
    const db = usePostgres();
    return await db`
      SELECT id_persona, nombre, celular, tipo, fecha_captacion
      FROM personas
      WHERE tipo = 'Referido'
    `;
  },

  async create(data: { nombre: string; celular?: string; tipo: string }) {
    const db = usePostgres();
    const [persona] = await db`
      INSERT INTO personas (nombre, celular, tipo)
      VALUES (${data.nombre}, ${data.celular ?? null}, ${data.tipo})
      RETURNING *
    `;
    return persona;
  },

  async update(id: number, data: Partial<{ nombre: string; celular: string; tipo: string }>) {
    const db = usePostgres();
    const [persona] = await db`
      UPDATE personas SET ${db(data)}
      WHERE id_persona = ${id}
      RETURNING *
    `;
    return persona ?? null;
  },

  async delete(id: number) {
    const db = usePostgres();
    const result = await db`DELETE FROM personas WHERE id_persona = ${id}`;
    return result.count > 0;
  },
};
