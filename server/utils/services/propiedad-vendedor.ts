export const propiedadVendedorService = {
  async listarPorPersona(personaId: number) {
    return await propiedadVendedorRepository.findByPersona(personaId);
  },

  async listarPorUsuario(usuarioId: number) {
    return await propiedadVendedorRepository.findByUsuario(usuarioId);
  },

  async obtener(propiedadId: number, personaId: number) {
    return await propiedadVendedorRepository.findOne(propiedadId, personaId);
  },

  async crearPropiedadYAsignar(data: {
    id_persona: number;
    id_usuario: number;
    direccion: string;
    descripcion?: string;
    medidas?: string;
    servicios_basicos?: string;
    precio_negociable: number;
    partida_registral?: string;
    observacion?: string;
  }) {
    // Primero crear la propiedad
    const propiedad = await propiedadRepository.create({
      direccion: data.direccion,
      descripcion: data.descripcion,
      medidas: data.medidas,
      servicios_basicos: data.servicios_basicos,
      precio_negociable: data.precio_negociable,
      partida_registral: data.partida_registral,
    });

    // Luego asignarla al vendedor (persona)
    await propiedadVendedorRepository.create({
      id_propiedad: propiedad.id_propiedad,
      id_persona: data.id_persona,
      id_usuario: data.id_usuario,
      observacion: data.observacion,
    });

    return propiedad;
  },

  async asignar(data: {
    id_propiedad: number;
    id_persona: number;
    id_usuario: number;
    observacion?: string;
  }) {
    return await propiedadVendedorRepository.create(data);
  },

  async actualizarObservacion(propiedadId: number, personaId: number, observacion: string) {
    return await propiedadVendedorRepository.update(propiedadId, personaId, { observacion });
  },

  async actualizar(
    propiedadId: number,
    data: {
      direccion?: string;
      descripcion?: string;
      medidas?: string;
      servicios_basicos?: string;
      precio_negociable?: number;
      partida_registral?: string;
    },
  ) {
    return await propiedadRepository.update(propiedadId, data);
  },

  async eliminar(propiedadId: number, personaId: number) {
    // Solo elimina la relación, no la propiedad
    return await propiedadVendedorRepository.delete(propiedadId, personaId);
  },
};
