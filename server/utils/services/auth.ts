export const authService = {
  async login(username: string, password: string) {
    const usuario = await usuarioRepository.findByUsername(username);

    if (!usuario) {
      throw createError({ statusCode: 401, message: "Usuario no encontrado" });
    }

    const isValid = verificarContrasena(usuario.contrasena, password);
    if (!isValid) {
      throw createError({ statusCode: 401, message: "Contraseña incorrecta" });
    }

    return {
      id: usuario.id_usuario,
      username: usuario.nombre_usuario,
      name: `${usuario.nombres} ${usuario.apellidos}`,
      rol: usuario.nombre_rol,
    };
  },

  async getProfile(userId: number) {
    const usuario = await usuarioRepository.findById(userId);
    if (!usuario) {
      throw createError({ statusCode: 404, message: "Usuario no encontrado" });
    }
    return usuario;
  },
};
