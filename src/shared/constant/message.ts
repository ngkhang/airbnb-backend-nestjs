export const baseMessage = {
  error: {
    hashingPasswordFail: 'Password hash failed',
    comparePasswordFail: 'Password compare failed',
  },
  success: {
    default: 'Successful',
  },
};

export const userMessage = {
  error: {
    notFound: (name: string, value: string) => `Not found ${name} with ${value}`,
  },
  success: {
    created: 'User account has been created successfully.',
  },
};
