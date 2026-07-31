import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import expenseReducer from './slices/expenseSlice.js';
import incomeReducer from './slices/incomeSlice.js';
import budgetReducer from './slices/budgetSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    incomes: incomeReducer,
    budgets: budgetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // allow FormData in actions (receipt uploads)
    }),
});
