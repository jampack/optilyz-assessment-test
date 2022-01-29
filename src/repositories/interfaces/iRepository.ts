interface IRepository<T> {
  getAll: () => Promise<T[]> ;
  findById: (_id: string) => Promise<T>;
  create: (item:T) => Promise<T>;
  update:(_id: string, item: object) => Promise<T> ;
  delete: (_id: string) => Promise<T>;
}

export default IRepository;
