import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';
import { getErrorMessage } from '../../utils/helpers.js';

export const fetchIncomes = createAsyncThunk('incomes/fetch', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/income', { params });
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addIncome = createAsyncThunk('incomes/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/income', payload);
    return data.income;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const editIncome = createAsyncThunk('incomes/edit', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/income/${id}`, payload);
    return data.income;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const removeIncome = createAsyncThunk('incomes/remove', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/income/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const initialState = { items: [], total: 0, page: 1, pages: 1, loading: false, error: null };

const incomeSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.incomes;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addIncome.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editIncome.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeIncome.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export default incomeSlice.reducer;
