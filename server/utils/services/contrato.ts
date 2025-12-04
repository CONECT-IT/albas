export const contratoService = {
  async listar(usuarioId: number) {
    // Listar contratos de personas que gestiona el asesor
    const gestiones = await gestionVendedorRepository.findByAsesor(usuarioId);
    const personaIds = gestiones.map((g: any) => g.id_persona);

    if (personaIds.length === 0) return [];

    const db = usePostgres();
    return await db`
      SELECT c.*, p.direccion, p.precio_negociable, per.nombre as vendedor_nombre
      FROM contrato c
      INNER JOIN propiedad p ON c.id_propiedad = p.id_propiedad
      INNER JOIN personas per ON c.id_persona = per.id_persona
      WHERE c.id_persona = ANY(${personaIds})
      ORDER BY c.fecha_emision DESC
    `;
  },

  async obtener(id: number) {
    const contrato = await contratoRepository.findById(id);
    if (!contrato) {
      throw createError({ statusCode: 404, message: "Contrato no encontrado" });
    }
    return contrato;
  },

  async registrar(data: {
    id_usuario: number;
    id_persona: number;
    propiedad: {
      direccion: string;
      descripcion?: string;
      medidas?: string;
      servicios_basicos?: string;
      precio_negociable: number;
      partida_registral?: string;
    };
  }) {
    // Verificar que el asesor gestiona a esta persona
    const gestion = await gestionVendedorRepository.findOne(data.id_usuario, data.id_persona);
    if (!gestion) {
      throw createError({ statusCode: 404, message: "No tienes acceso a esta persona" });
    }

    // Verificar que sea Cliente
    const persona = await personaRepository.findById(data.id_persona);
    if (!persona || persona.tipo !== "Cliente") {
      throw createError({
        statusCode: 400,
        message: "La persona debe ser Cliente para registrar contrato",
      });
    }

    // Crear propiedad
    const propiedad = await propiedadRepository.create(data.propiedad);

    // Crear contrato enlazando propiedad + persona
    const contrato = await contratoRepository.create({
      id_propiedad: propiedad.id_propiedad,
      id_persona: data.id_persona,
    });

    return { propiedad, contrato };
  },

  async actualizarPropiedad(
    usuarioId: number,
    idContrato: number,
    data: Partial<{
      direccion: string;
      descripcion: string;
      medidas: string;
      servicios_basicos: string;
      precio_negociable: number;
      partida_registral: string;
    }>,
  ) {
    const contrato = await this.obtener(idContrato);

    // Verificar que el asesor gestiona a la persona del contrato
    const gestion = await gestionVendedorRepository.findOne(usuarioId, contrato.id_persona);
    if (!gestion) {
      throw createError({ statusCode: 404, message: "No tienes acceso a este contrato" });
    }

    return await propiedadRepository.update(contrato.id_propiedad, data);
  },

  async eliminar(usuarioId: number, idContrato: number) {
    const contrato = await this.obtener(idContrato);

    // Verificar que el asesor gestiona a la persona del contrato
    const gestion = await gestionVendedorRepository.findOne(usuarioId, contrato.id_persona);
    if (!gestion) {
      throw createError({ statusCode: 404, message: "No tienes acceso a este contrato" });
    }

    // Eliminar contrato (la propiedad se elimina por CASCADE)
    return await contratoRepository.delete(idContrato);
  },
};
