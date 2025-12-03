export const ventasService = {
  async listarLeads(usuarioId: number) {
    const gestiones = await gestionCompradorRepository.findByAsesor(usuarioId);
    return gestiones.filter((g: any) => g.tipo === "Lead Alvas" || g.tipo === "Lead Propio");
  },

  async registrarLead(data: {
    nombre: string;
    celular?: string;
    tipo: "Lead Alvas" | "Lead Propio";
    id_usuario: number;
    observacion?: string;
  }) {
    const persona = await personaRepository.create({
      nombre: data.nombre,
      celular: data.celular,
      tipo: data.tipo,
    });

    const cat = await categoriaRepository.findByNombre("Comprador");
    if (cat) {
      await categoriaRepository.asignarCategoria(persona.id_persona, cat.id_categoria);
    }

    await gestionCompradorRepository.create({
      id_usuario: data.id_usuario,
      id_persona: persona.id_persona,
      observacion: data.observacion,
    });

    return persona;
  },

  async listarClientes(usuarioId: number) {
    const gestiones = await gestionCompradorRepository.findByAsesor(usuarioId);
    return gestiones.filter((g: any) => g.tipo === "Cliente");
  },

  async registrarCliente(data: {
    nombre: string;
    celular?: string;
    id_usuario: number;
    observacion?: string;
  }) {
    const persona = await personaRepository.create({
      nombre: data.nombre,
      celular: data.celular,
      tipo: "Cliente",
    });

    const cat = await categoriaRepository.findByNombre("Comprador");
    if (cat) {
      await categoriaRepository.asignarCategoria(persona.id_persona, cat.id_categoria);
    }

    await gestionCompradorRepository.create({
      id_usuario: data.id_usuario,
      id_persona: persona.id_persona,
      observacion: data.observacion,
    });

    return persona;
  },

  async listarReferidos(usuarioId: number) {
    const gestiones = await gestionCompradorRepository.findByAsesor(usuarioId);
    return gestiones.filter((g: any) => g.tipo === "Referido");
  },

  async registrarReferido(data: {
    nombre: string;
    celular?: string;
    id_usuario: number;
    observacion?: string;
  }) {
    const persona = await personaRepository.create({
      nombre: data.nombre,
      celular: data.celular,
      tipo: "Referido",
    });

    const cat = await categoriaRepository.findByNombre("Comprador");
    if (cat) {
      await categoriaRepository.asignarCategoria(persona.id_persona, cat.id_categoria);
    }

    await gestionCompradorRepository.create({
      id_usuario: data.id_usuario,
      id_persona: persona.id_persona,
      observacion: data.observacion,
    });

    return persona;
  },

  async actualizarPersona(id: number, data: Partial<{ nombre: string; celular: string }>) {
    return await personaRepository.update(id, data);
  },

  async actualizarGestion(
    usuarioId: number,
    personaId: number,
    data: Partial<{ estado_comprador: string; observacion: string }>,
  ) {
    return await gestionCompradorRepository.update(usuarioId, personaId, data);
  },

  async obtenerGestion(usuarioId: number, personaId: number) {
    return await gestionCompradorRepository.findOne(usuarioId, personaId);
  },

  async eliminarGestion(usuarioId: number, personaId: number) {
    return await gestionCompradorRepository.delete(usuarioId, personaId);
  },

  async listarInteresadosPorPropiedad(propiedadId: number) {
    return await interesadoRepository.findByPropiedad(propiedadId);
  },

  async agregarInteresado(propiedadId: number, personaId: number) {
    return await interesadoRepository.create({ id_propiedad: propiedadId, id_persona: personaId });
  },

  async marcarVendido(propiedadId: number, personaId: number) {
    return await interesadoRepository.update(propiedadId, personaId, { vendido: true });
  },

  async marcarSeparado(propiedadId: number, personaId: number, separado: boolean) {
    return await interesadoRepository.update(propiedadId, personaId, { separado });
  },

  async removerInteresado(propiedadId: number, personaId: number) {
    return await interesadoRepository.delete(propiedadId, personaId);
  },
};
