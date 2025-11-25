import type { GenericRepository } from "#shared/services/generic-repository";
import type { User } from "#shared/types/user";
import { usePostgres } from "#imports";

export interface UserRepository extends GenericRepository<User, string> {
  findByRole(roleName: string): Promise<User[]>;
}

export class PostgresUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const db = usePostgres();
    try {
      const rows = await db`
        SELECT
          u.id_usuario,
          u.nombre_usuario,
          u.nombres,
          u.apellidos,
          u.correo,
          u.id_rol,
          r.nombre_rol
        FROM usuarios u
        LEFT JOIN rol r ON u.id_rol = r.id_rol
      `.values();
      return rows.map((r) => ({
        id_usuario: r[0],
        nombre_usuario: r[1],
        nombres: r[2],
        apellidos: r[3],
        correo: r[4],
        id_rol: r[5],
        nombre_rol: r[6],
      }));
    } finally {
      await db.end();
    }
  }

  async findByRole(roleName: string): Promise<User[]> {
    const db = usePostgres();
    try {
      const rows = await db`
         SELECT
           u.id_usuario,
           u.nombre_usuario,
           u.nombres,
           u.apellidos,
           u.correo
         FROM usuarios u
         INNER JOIN rol r ON u.id_rol = r.id_rol
         WHERE r.nombre_rol = ${roleName}
       `.values();
      return rows.map((asesor) => ({
        id_usuario: asesor[0],
        nombre_usuario: asesor[1],
        nombres: asesor[2],
        apellidos: asesor[3],
        correo: asesor[4],
      }));
    } finally {
      await db.end();
    }
  }
}

export const userRepo = new PostgresUserRepository();
export default userRepo;
