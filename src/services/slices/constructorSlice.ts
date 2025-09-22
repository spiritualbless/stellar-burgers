import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConstructorState {
  bun: any | null;
  ingredients: any[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<any>) => {
      state.bun = action.payload;
      return state;
    },
    addIngredient: (state, action: PayloadAction<any>) => {
      if (!state.ingredients) {
        state.ingredients = [];
      }
      state.ingredients.push(action.payload);
      return state;
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
      return state;
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedIngredient = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, draggedIngredient);
      return state;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      return state;
    },
  },
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = constructorSlice.actions;

export default constructorSlice.reducer;