export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export const required = (message = 'This field is required') => ({
  required: message,
});

export const minLength = (length, message) => ({
  minLength: { value: length, message: message || `Must be at least ${length} characters` },
});

export const positiveNumber = (message = 'Must be a positive number') => ({
  validate: (value) => Number(value) > 0 || message,
});
