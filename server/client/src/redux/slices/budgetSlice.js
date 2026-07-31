import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';
import { getErrorMessage } from '../../utils/helpers.js';

export const fetchBudgets = createAsyncThunk('budgets/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/budget', { params });
    return data.budgets;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addBudget = createAsyncThunk('budgets/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/budget', payload);
    return data.budget;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const editBudget = createAsyncThunk('budgets/edit', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/budget/${id}`, payload);
    return data.budget;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const removeBudget = createAsyncThunk('budgets/remove', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/budget/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const initialState = { items: [], loading: false, error: null };

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editBudget.fulfilled, (state, action) => {
        const idx = state.items.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      });
  },
});

export default budgetSlice.reducer;
