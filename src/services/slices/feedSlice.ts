import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

export interface FeedState {
  orders: TOrdersData | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: null,
  loading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async () => {
    const data = await getFeedsApi();
    return data;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      });
  },
});

export default feedSlice.reducer;

