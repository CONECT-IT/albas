export const usuarioRepository = {
  async findAll() {
    const db = usePostgres();
    return await db`
      SELECT u.id_usuario, u.nombre_usuario, u.nombres, u.apellidos, u.correo, u.supervisor_id, r.nombre_rol
      FROM usuarios u
      LEFT JOIN rol r ON u.id_rol = r.id_rol
    `;
  },

  async findById(id: number) {
    const db = usePostgres();
    const [usuario] = await db`
      SELECT u.id_usuario, u.nombre_usuario, u.nombres, u.apellidos, u.correo, u.supervisor_id, r.nombre_rol
      FROM usuarios u
      LEFT JOIN rol r ON u.id_rol = r.id_rol
      WHERE u.id_usuario = ${id}
    `;
    return usuario ?? null;
  },

  async findByUsername(username: string) {
    const db = usePostgres();
    const [usuario] = await db`
      SELECT u.*, r.nombre_rol
      FROM usuarios u
      LEFT JOIN rol r ON u.id_rol = r.id_rol
      WHERE u.nombre_usuario = ${username}
    `;
    return usuario ?? null;
  },

  async findByRole(roleName: string) {
    const db = usePostgres();
    return await db`
      SELECT u.id_usuario, u.nombre_usuario, u.nombres, u.apellidos, u.correo, u.supervisor_id
      FROM usuarios u
      INNER JOIN rol r ON u.id_rol = r.id_rol
      WHERE r.nombre_rol = ${roleName}
    `;
  },

  async findBySupervisor(supervisorId: number) {
    const db = usePostgres();
    return await db`
      SELECT u.id_usuario, u.nombre_usuario, u.nombres, u.apellidos, u.correo
      FROM usuarios u
      WHERE u.supervisor_id = ${supervisorId}
    `;
  },

  async create(data: {
    nombre_usuario: string;
    contrasena: string;
    correo: string;
    nombres: string;
    apellidos: string;
    id_rol: number;
    supervisor_id?: number;
  }) {
    const db = usePostgres();
    const [usuario] = await db`
      INSERT INTO usuarios (nombre_usuario, contrasena, correo, nombres, apellidos, id_rol, supervisor_id)
      VALUES (${data.nombre_usuario}, ${data.contrasena}, ${data.correo}, ${data.nombres}, ${data.apellidos}, ${data.id_rol}, ${data.supervisor_id ?? null})
      RETURNING id_usuario, nombre_usuario, nombres, apellidos, correo
    `;
    return usuario;
  },

  async update(
    id: number,
    data: Partial<{
      nombre_usuario: string;
      correo: string;
      nombres: string;
      apellidos: string;
      supervisor_id: number;
    }>,
  ) {
    const db = usePostgres();
    const [usuario] = await db`
      UPDATE usuarios SET ${db(data)}
      WHERE id_usuario = ${id}
      RETURNING id_usuario, nombre_usuario, nombres, apellidos, correo
    `;
    return usuario ?? null;
  },

  async delete(id: number) {
    const db = usePostgres();
    const result = await db`DELETE FROM usuarios WHERE id_usuario = ${id}`;
    return result.count > 0;
  },
};
