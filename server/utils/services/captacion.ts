import postgres, { RowList } from "postgres";

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
    const persona = await personaRepository.findByNumber(celular);
    return { persona: persona, esRepetido: (persona) ? true : false};
  },

  async leadActivo(id_lead: number) {
    const lead = await gestionVendedorRepository.findByPersonaActiva(id_lead);
    const safeLead = Array.from(lead || []);
    return { lead: safeLead, esActivo: safeLead.length > 0 };
  },

  // === CLIENTES VENDEDORES ===
  async listarClientes(usuarioId: number) {
    const db = usePostgres();
    return await db`
      SELECT 
        uv.id_usuario,
        uv.id_persona,
        uv.estado_vendedor,
        uv.observacion,
        p.nombre,
        p.celular,
        p.tipo,
        p.fecha_captacion,
        c.id_contrato,
        c.fecha_emision,
        pr.id_propiedad,
        pr.direccion,
        pr.descripcion,
        pr.medidas,
        pr.servicios_basicos,
        pr.precio_negociable,
        pr.partida_registral
      FROM usuario_vendedor uv
      INNER JOIN personas p ON uv.id_persona = p.id_persona
      LEFT JOIN contrato c ON c.id_persona = p.id_persona
      LEFT JOIN propiedad pr ON c.id_propiedad = pr.id_propiedad
      WHERE uv.id_usuario = ${usuarioId} AND p.tipo = 'Cliente'
    `;
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

  async verificarGestion(usuarioId: number, personaId: number) {
    const gestion = await gestionVendedorRepository.findOne(usuarioId, personaId);
    if (!gestion) {
      throw createError({ statusCode: 404, message: "No tienes acceso a esta persona" });
    }
    return gestion;
  },

  async actualizarPersona(
    usuarioId: number,
    personaId: number,
    data: Partial<{ nombre: string; celular: string }>,
  ) {
    await this.verificarGestion(usuarioId, personaId);
    return await personaRepository.update(personaId, data);
  },

  async actualizarGestion(
    usuarioId: number,
    personaId: number,
    data: Partial<{ estado_vendedor: string; observacion: string }>,
  ) {
    await this.verificarGestion(usuarioId, personaId);
    return await gestionVendedorRepository.update(usuarioId, personaId, data);
  },

  async obtenerGestion(usuarioId: number, personaId: number) {
    return await this.verificarGestion(usuarioId, personaId);
  },

  async eliminarGestion(usuarioId: number, personaId: number) {
    await this.verificarGestion(usuarioId, personaId);
    return await gestionVendedorRepository.delete(usuarioId, personaId);
  },
};
