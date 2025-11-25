export interface GenericRepository<T, ID = string> {
  findAll(): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: ID, partial: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}
