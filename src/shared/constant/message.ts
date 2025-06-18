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
    emailAlreadyRegistered: 'An account with this email address already exists.',
  },
  success: {
    created: 'User account has been created successfully.',
  },
};

export const authMessage = {
  error: {
    emailNotRegistered: 'Email address is not registered',
    incorrectPassword: 'Password is incorrect',
  },
  success: {
    login: 'Login successfully',
  },
};
