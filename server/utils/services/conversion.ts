export const conversionService = {
  async convertir(data: {
    id_persona: number;
    id_usuario: number;
    tipo_nuevo: "Cliente";
  }) {
    // 1. Obtener persona actual
    const persona = await personaRepository.findById(data.id_persona);
    if (!persona) {
      throw createError({ statusCode: 404, message: "Persona no encontrada" });
    }

    if (persona.tipo === "Cliente") {
      throw createError({ statusCode: 400, message: "La persona ya es cliente" });
    }

    const tipoAnterior = persona.tipo;

    // 2. Actualizar tipo de persona
    await personaRepository.update(data.id_persona, { tipo: data.tipo_nuevo });

    // 3. Registrar conversión
    await conversionRepository.create({
      id_persona: data.id_persona,
      id_usuario: data.id_usuario,
      tipo_anterior: tipoAnterior,
      tipo_nuevo: data.tipo_nuevo,
    });

    return { tipo_anterior: tipoAnterior, tipo_nuevo: data.tipo_nuevo };
  },

  async historialPorPersona(personaId: number) {
    return await conversionRepository.findByPersona(personaId);
  },

  async historialPorAsesor(usuarioId: number) {
    return await conversionRepository.findByAsesor(usuarioId);
  },
};
