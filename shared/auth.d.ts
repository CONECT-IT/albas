declare module "#auth-utils" {
  interface User {
    id: number;
    username: string;
    name: string;
    phone?: string;
    hireDate?: string;
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
