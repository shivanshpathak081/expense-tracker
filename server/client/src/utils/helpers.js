export const formatCurrency = (value, currency = 'USD') => {
  const number = Number(value) || 0;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(number);
  } catch {
    return `$${number.toFixed(2)}`;
  }
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
