// Mongoose type declarations to fix database method call issues

declare module 'mongoose' {
  interface Model<T> {
    findById(id: any, projection?: any, options?: any): Promise<any>;
    findOne(filter?: any, projection?: any, options?: any): Promise<any>;
    find(filter?: any, projection?: any, options?: any): Promise<any>;
    create(doc: any): Promise<any>;
    findByIdAndUpdate(id: any, update?: any, options?: any): Promise<any>;
    findByIdAndDelete(id: any, options?: any): Promise<any>;
    populate(path: any): Promise<any>;
  }

  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
    populate(path: any): this;
    lean(): this;
    exec(): Promise<ResultType>;
  }

  interface Document {
    _id: any;
    toObject(): any;
    populate(path: any): Promise<this>;
  }
}

export {};
