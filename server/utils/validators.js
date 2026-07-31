// Simple, dependency-free validation helpers used across controllers.

export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export const isPositiveNumber = (value) => typeof value === 'number' && !Number.isNaN(value) && value >= 0;

export const validateRegisterInput = ({ name, email, password }) => {
  const errors = [];
  if (!isNonEmptyString(name)) errors.push('Name is required');
  if (!isValidEmail(email)) errors.push('A valid email is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
  return errors;
};

export const validateExpenseInput = ({ title, amount, category, date }) => {
  const errors = [];
  if (!isNonEmptyString(title)) errors.push('Title is required');
  if (!isPositiveNumber(Number(amount))) errors.push('Amount must be a positive number');
  if (!isNonEmptyString(category)) errors.push('Category is required');
  if (!date) errors.push('Date is required');
  return errors;
};
