export interface IBaseRepository {
  create(data: any): Promise<any>;
  update(id: any, data: any): Promise<any>;
  delete(id: any): Promise<any>;
  findOne(id: any): Promise<any>;
  findAll(filter?: any): Promise<any>;
}
