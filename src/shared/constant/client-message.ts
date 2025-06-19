export const CLIENT_MESSAGES = {
  SUCCESS: {
    OK: 'Successful',
    AUTH_LOGIN: 'Login successfully',
    AUTH_REGISTER: 'Register successfully',
    USER_CREATED: 'Account created successfully',
  },
  ERROR: {
    // General
    NOT_FOUND: 'The requested resource was not found',

    // Authentication
    AUTH_EMAIL_NOT_REGISTERED: 'Email address is not registered',
    AUTH_EMAIL_ALREADY_REGISTERED: 'An account with this email address already exists',
    AUTH_PASSWORD_INCORRECT: 'Password is incorrect',
    AUTH_REQUIRED: 'Please log in to continue',

    // Token
    AUTH_TOKEN_MISSING: 'Authentication token is missing',
    AUTH_TOKEN_EXPIRED: 'Your session has expired. Please log in again',
    AUTH_TOKEN_INVALID: 'Invalid session. Please log in again',
    AUTH_TOKEN_INCORRECT: 'The provided token is incorrect',
  },
};
