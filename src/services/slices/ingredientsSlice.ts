import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';

export interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    console.log('fetchIngredients: starting API call');
    const data = await getIngredientsApi();
    console.log('fetchIngredients: received data:', data.length, 'items');
    return data;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        console.log('ingredientsSlice: pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        console.log('ingredientsSlice: fulfilled with', action.payload.length, 'items');
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        console.log('ingredientsSlice: rejected', action.error.message);
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  },
});

export default ingredientsSlice.reducer;

