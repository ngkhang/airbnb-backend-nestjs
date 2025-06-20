type ValidType = 'URL' | 'phone number' | 'date string' | 'email' | 'UUID';

export const ValidationMessages = {
  notEmpty: (field: string) => `The ${field} field is required.`,
  mustString: (field: string) => `The ${field} field must be a string.`,
  mustBeValidType: (field: string, type: ValidType) => `The ${field} field must be a valid ${type}.`,
  mustBeFollowValues: (field: string, values: string[]) =>
    `The ${field} field must be one of the following values: ${values.join(', ')}.`,
  mustMinLength: (field: string, min: number) => `The ${field} field must be length at least ${min}.`,
  mustMaxLength: (field: string, max: number) => `The ${field} field cannot length exceed ${max}.`,
  mustContainCharacter: (field: string, type: 'lowercase' | 'uppercase' | 'number' | 'special') =>
    `The ${field} field must contain at least one ${type} character.`,
};
