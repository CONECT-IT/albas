declare module "#auth-utils" {
  interface User {
    id: number;
    nombre_usuario: string;
    nombre_completo: string;
    correo: string;
    rol: string;
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
