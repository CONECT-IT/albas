export const asesorService = {
  async listarConStats(adminId: number) {
    const db = usePostgres();
    return await db`
      SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.correo,
        u.nombres,
        u.apellidos,
        COUNT(DISTINCT CASE 
          WHEN p.tipo IN ('Lead Alvas', 'Lead Propio') 
          THEN p.id_persona 
        END) AS total_leads,
        COUNT(DISTINCT CASE 
          WHEN c.tipo_anterior IN ('Lead Alvas', 'Lead Propio')
          AND c.tipo_nuevo = 'Cliente'
          THEN c.id_conversion
        END) AS total_convertidos
      FROM usuarios u
      LEFT JOIN usuario_comprador uc ON uc.id_usuario = u.id_usuario
      LEFT JOIN usuario_vendedor uv ON uv.id_usuario = u.id_usuario
      LEFT JOIN personas p ON p.id_persona = COALESCE(uc.id_persona, uv.id_persona)
      LEFT JOIN conversiones c ON c.id_usuario = u.id_usuario
      WHERE u.supervisor_id = ${adminId}
      GROUP BY u.id_usuario, u.nombre_usuario, u.correo, u.nombres, u.apellidos
      ORDER BY u.id_usuario
    `;
  },

  async cargaAsesores() {
    const cargas = await gestionVendedorRepository.getCargaVentas();
    const asesores = Array.from(cargas || []);
    return asesores;
  },

  async rendimientoAsesor(asesorId: number) {
    const total_leads = await gestionVendedorRepository.findByAsesor(asesorId);
    const total_clientes = total_leads.filter((tl: any) => tl.tipo === "Cliente");
    const rendimiento =
      total_leads.length > 0 ? (total_clientes.length / total_leads.length) * 100 : 0;
    return rendimiento;
  },

  async obtener(id: number) {
    const asesor = await usuarioRepository.findById(id);
    if (!asesor || asesor.nombre_rol !== "Asesor") {
      throw createError({ statusCode: 404, message: "Asesor no encontrado" });
    }
    return asesor;
  },

  async crear(data: {
    nombre_usuario: string;
    contrasena: string;
    correo: string;
    nombres: string;
    apellidos: string;
    supervisor_id?: number;
  }) {
    const hashedPassword = hashContrasena(data.contrasena);
    return await usuarioRepository.create({
      ...data,
      contrasena: hashedPassword,
      id_rol: 2,
    });
  },

  async actualizar(
    id: number,
    data: Partial<{
      nombre_usuario: string;
      correo: string;
      nombres: string;
      apellidos: string;
      supervisor_id: number;
    }>,
  ) {
    await this.obtener(id);
    return await usuarioRepository.update(id, data);
  },

  async eliminar(id: number) {
    await this.obtener(id);
    return await usuarioRepository.delete(id);
  },
};
