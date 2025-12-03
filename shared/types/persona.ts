export interface Persona {
  id_persona: number;
  nombre: string;
  celular: string | null;
  tipo: "Cliente" | "Referido" | "Lead Alvas" | "Lead Propio";
  fecha_captacion: string;
}
