// Database operation helpers with proper error handling

export const dbOperations = {
  // Safe wrapper for findById
  findById: async (model: any, id: any, options?: any) => {
    try {
      return await (model as any).findById(id, options);
    } catch (error) {
      console.error('Database findById error:', error);
      throw error;
    }
  },

  // Safe wrapper for findOne
  findOne: async (model: any, filter: any, options?: any) => {
    try {
      return await (model as any).findOne(filter, options);
    } catch (error) {
      console.error('Database findOne error:', error);
      throw error;
    }
  },

  // Safe wrapper for find
  find: async (model: any, filter: any, options?: any) => {
    try {
      return await (model as any).find(filter, options);
    } catch (error) {
      console.error('Database find error:', error);
      throw error;
    }
  },

  // Safe wrapper for create
  create: async (model: any, data: any) => {
    try {
      return await (model as any).create(data);
    } catch (error) {
      console.error('Database create error:', error);
      throw error;
    }
  },

  // Safe wrapper for findByIdAndUpdate
  findByIdAndUpdate: async (model: any, id: any, update: any, options?: any) => {
    try {
      return await (model as any).findByIdAndUpdate(id, update, options);
    } catch (error) {
      console.error('Database findByIdAndUpdate error:', error);
      throw error;
    }
  },

  // Safe wrapper for findByIdAndDelete
  findByIdAndDelete: async (model: any, id: any, options?: any) => {
    try {
      return await (model as any).findByIdAndDelete(id, options);
    } catch (error) {
      console.error('Database findByIdAndDelete error:', error);
      throw error;
    }
  }
};

// Error handler for API routes
export const handleDatabaseError = (error: unknown): { message: string; error?: string } => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
  console.error('Database operation failed:', errorMessage);
  
  if (error instanceof Error && error.stack) {
    console.error('Error stack:', error.stack);
  }
  
  return {
    message: 'Database operation failed',
    error: errorMessage
  };
};

// Type-safe user finder
export const findUserById = async (User: any, id: any) => {
  return dbOperations.findById(User, id);
};

// Type-safe populate wrapper
export const populateQuery = (query: any, populateOptions: any) => {
  return (query as any).populate(populateOptions);
};
