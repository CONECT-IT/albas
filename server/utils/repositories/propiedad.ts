export const propiedadRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`
      SELECT id_propiedad, direccion, descripcion, medidas, servicios_basicos, precio_negociable, partida_registral
      FROM propiedad
    `;
  },

  async findById(id: number) {
    const db = usePostgres();
    const [propiedad] = await db`
      SELECT id_propiedad, direccion, descripcion, medidas, servicios_basicos, precio_negociable, partida_registral
      FROM propiedad
      WHERE id_propiedad = ${id}
    `;
    return propiedad ?? null;
  },

  async create(data: {
    direccion: string;
    descripcion?: string;
    medidas?: string;
    servicios_basicos?: string;
    precio_negociable: number;
    partida_registral?: string;
  }) {
    const db = usePostgres();
    const [propiedad] = await db`
      INSERT INTO propiedad (direccion, descripcion, medidas, servicios_basicos, precio_negociable, partida_registral)
      VALUES (${data.direccion}, ${data.descripcion ?? null}, ${data.medidas ?? null}, ${data.servicios_basicos ?? null}, ${data.precio_negociable}, ${data.partida_registral ?? null})
      RETURNING *
    `;
    return propiedad;
  },

  async update(
    id: number,
    data: Partial<{
      direccion: string;
      descripcion: string;
      medidas: string;
      servicios_basicos: string;
      precio_negociable: number;
      partida_registral: string;
    }>,
  ) {
    const db = usePostgres();
    const [propiedad] = await db`
      UPDATE propiedad SET ${db(data)}
      WHERE id_propiedad = ${id}
      RETURNING *
    `;
    return propiedad ?? null;
  },

  async delete(id: number) {
    const db = usePostgres();
    const result = await db`DELETE FROM propiedad WHERE id_propiedad = ${id}`;
    return result.count > 0;
  },
};
