export const citasService = {
  async listar() {
    return await citaRepository.findAll();
  },

  async listarPorAsesor(usuarioId: number) {
    return await citaRepository.findByAsesor(usuarioId);
  },

  async obtener(id: number) {
    const cita = await citaRepository.findById(id);
    if (!cita) {
      throw createError({ statusCode: 404, message: "Cita no encontrada" });
    }
    return cita;
  },

  async agendar(data: {
    fecha_agendada: string;
    observacion?: string;
    id_persona: number;
    id_usuario: number;
  }) {
    return await citaRepository.create({
      ...data,
      estado_visita_guiada: "Realizó visita", // Estado inicial pendiente
    });
  },

  async reprogramar(id: number, nuevaFecha: string, observacion?: string) {
    await this.obtener(id);
    return await citaRepository.update(id, {
      fecha_agendada: nuevaFecha,
      estado_visita_guiada: "Reprogramó",
      ...(observacion && { observacion }),
    });
  },

  async actualizarEstado(id: number, estado: string, observacion?: string) {
    await this.obtener(id);
    return await citaRepository.update(id, {
      estado_visita_guiada: estado,
      ...(observacion && { observacion }),
    });
  },

  async cancelar(id: number, observacion?: string) {
    return await this.actualizarEstado(id, "Canceló", observacion);
  },

  async eliminar(id: number) {
    await this.obtener(id);
    return await citaRepository.delete(id);
  },
};
