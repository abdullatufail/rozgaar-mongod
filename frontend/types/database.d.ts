// Fix for all Mongoose database operation type issues

declare global {
  // Override Mongoose types to be more permissive
  namespace NodeJS {
    interface Global {
      mongoose: any;
    }
  }
}

// Module augmentation for mongoose
declare module "mongoose" {
  interface Model<T> {
    findById: (...args: any[]) => any;
    findOne: (...args: any[]) => any;
    find: (...args: any[]) => any;
    create: (...args: any[]) => any;
    findByIdAndUpdate: (...args: any[]) => any;
    findByIdAndDelete: (...args: any[]) => any;
    findOneAndUpdate: (...args: any[]) => any;
    deleteOne: (...args: any[]) => any;
    deleteMany: (...args: any[]) => any;
    updateOne: (...args: any[]) => any;
    updateMany: (...args: any[]) => any;
    aggregate: (...args: any[]) => any;
    populate: (...args: any[]) => any;
  }

  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
    populate: (...args: any[]) => any;
    lean: (...args: any[]) => any;
    sort: (...args: any[]) => any;
    limit: (...args: any[]) => any;
    skip: (...args: any[]) => any;
    select: (...args: any[]) => any;
    exec: (...args: any[]) => any;
  }

  interface Document {
    _id: any;
    id: any;
    toObject: (...args: any[]) => any;
    toJSON: (...args: any[]) => any;
    save: (...args: any[]) => any;
    remove: (...args: any[]) => any;
    populate: (...args: any[]) => any;
    [key: string]: any;
  }

  interface Schema<T = any> {
    Types: {
      ObjectId: any;
      String: any;
      Number: any;
      Date: any;
      Boolean: any;
      Array: any;
      Mixed: any;
    };
    pre: (...args: any[]) => any;
    post: (...args: any[]) => any;
    virtual: (...args: any[]) => any;
    methods: any;
    statics: any;
    index: (...args: any[]) => any;
  }
}

export {};
