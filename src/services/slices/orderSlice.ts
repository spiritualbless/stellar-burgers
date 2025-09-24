import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { clearConstructor } from './constructorSlice';

export interface OrderState {
  currentOrder: TOrder | null;
  orderNumber: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orderNumber: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { dispatch }) => {
    const data = await orderBurgerApi(ingredients);

    dispatch(clearConstructor());
    return data;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.orderNumber = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log('orderSlice: createOrder.fulfilled with payload:', action.payload);
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.orderNumber = action.payload.order.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get order';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
