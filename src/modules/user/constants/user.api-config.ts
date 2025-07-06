export const USER_API_CONFIG = {
  tagDoc: 'Users',
  path: 'users',
  endpoints: {
    getAll: '',
    getById: ':id',
    getByEmail: 'email/:email',
    create: '',
    update: ':id',
    delete: ':id',
  },
};
