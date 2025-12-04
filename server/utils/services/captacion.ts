export const captacionService = {
  // === LEADS VENDEDORES ===
  async listarLeads(usuarioId: number) {
    const gestiones = await gestionVendedorRepository.findByAsesor(usuarioId);
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

    const cat = await categoriaRepository.findByNombre("Vendedor");
    if (cat) {
      await categoriaRepository.asignarCategoria(persona.id_persona, cat.id_categoria);
    }

    await gestionVendedorRepository.create({
      id_usuario: data.id_usuario,
      id_persona: persona.id_persona,
      observacion: data.observacion,
    });

    return persona;
  },

  async leadRepetido(celular: string) {
    const persona = (await personaRepository.findByNumber(celular)) as any | null;
    return { persona, esRepetido: persona !== null };
  },

  async leadActivo(id_lead: number) {
    const lead = (await gestionVendedorRepository.findByPersonaActiva(id_lead)) as any[] | null;
    const safeLead = Array.isArray(lead) ? lead : [];
    return { lead: safeLead, esActivo: safeLead.length > 0 };
  },

  // === CLIENTES VENDEDORES ===
  async listarClientes(usuarioId: number) {
    const gestiones = await gestionVendedorRepository.findByAsesor(usuarioId);
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

    const cat = await categoriaRepository.findByNombre("Vendedor");
    if (cat) {
      await categoriaRepository.asignarCategoria(persona.id_persona, cat.id_categoria);
    }

    await gestionVendedorRepository.create({
      id_usuario: data.id_usuario,
      id_persona: persona.id_persona,
      observacion: data.observacion,
    });

    return persona;
  },

  // === REFERIDOS VENDEDORES ===
  async listarReferidos(usuarioId: number) {
    const gestiones = await gestionVendedorRepository.findByAsesor(usuarioId);
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

    const cat = await categoriaRepository.findByNombre("Vendedor");
    if (cat) {
      await categoriaRepository.asignarCategoria(persona.id_persona, cat.id_categoria);
    }

    await gestionVendedorRepository.create({
      id_usuario: data.id_usuario,
      id_persona: persona.id_persona,
      observacion: data.observacion,
    });

    return persona;
  },

  // === OPERACIONES COMUNES ===
  async actualizarPersona(id: number, data: Partial<{ nombre: string; celular: string }>) {
    return await personaRepository.update(id, data);
  },

  async actualizarGestion(
    usuarioId: number,
    personaId: number,
    data: Partial<{ estado_vendedor: string; observacion: string }>,
  ) {
    return await gestionVendedorRepository.update(usuarioId, personaId, data);
  },

  async obtenerGestion(usuarioId: number, personaId: number) {
    return await gestionVendedorRepository.findOne(usuarioId, personaId);
  },

  async eliminarGestion(usuarioId: number, personaId: number) {
    return await gestionVendedorRepository.delete(usuarioId, personaId);
  },
};
