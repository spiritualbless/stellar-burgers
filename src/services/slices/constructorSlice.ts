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
      return { ...state, bun: action.payload };
    },
    addIngredient: (state, action: PayloadAction<any>) => {
      const nextIngredients = (state.ingredients || []).concat(action.payload);
      return { ...state, ingredients: nextIngredients };
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const nextIngredients = (state.ingredients || []).filter(
        (ingredient) => ingredient.id !== action.payload
      );
      return { ...state, ingredients: nextIngredients };
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const next = (state.ingredients || []).slice();
      const [dragged] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, dragged);
      return { ...state, ingredients: next };
    },
    clearConstructor: () => {
      return { bun: null, ingredients: [] };
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