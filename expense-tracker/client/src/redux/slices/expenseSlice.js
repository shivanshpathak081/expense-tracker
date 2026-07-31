import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';
import { getErrorMessage } from '../../utils/helpers.js';

export const fetchExpenses = createAsyncThunk('expenses/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/expenses', { params });
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addExpense = createAsyncThunk('expenses/add', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/expenses', formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const editExpense = createAsyncThunk('expenses/edit', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/expenses/${id}`, formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return data.expense;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const removeExpense = createAsyncThunk('expenses/remove', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/expenses/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const initialState = {
  items: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
  lastBudgetAlert: null,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearBudgetAlert: (state) => {
      state.lastBudgetAlert = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.expenses;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload.expense);
        state.lastBudgetAlert = action.payload.budgetAlert;
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        const idx = state.items.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e._id !== action.payload);
      });
  },
});

export const { clearBudgetAlert } = expenseSlice.actions;
export default expenseSlice.reducer;
