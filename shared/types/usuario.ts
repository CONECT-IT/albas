export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  contrasena: string;
  correo: string;
  nombres: string;
  apellidos: string;
  supervisor_id: number | null;
  id_rol: number;
}
