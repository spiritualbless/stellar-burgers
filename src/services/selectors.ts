import type { RootState } from './rootReducer';

// Auth selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Ingredients selectors
export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) => state.ingredients.loading;
export const selectIngredientsError = (state: RootState) => state.ingredients.error;

// Constructor selectors
export const selectConstructorBun = (state: RootState) => state.constructor.bun;
export const selectConstructorIngredients = (state: RootState) => state.constructor.ingredients;
export const selectConstructorTotal = (state: RootState) => {
  const bun = state.constructor.bun;
  const ingredients = state.constructor.ingredients || [];
  
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce((sum: number, ingredient: any) => sum + ingredient.price, 0);
  
  return bunPrice + ingredientsPrice;
};

// Order selectors
export const selectCurrentOrder = (state: RootState) => state.order.currentOrder;
export const selectOrderNumber = (state: RootState) => state.order.orderNumber;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;

// Feed selectors
export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedLoading = (state: RootState) => state.feed.loading;
export const selectFeedError = (state: RootState) => state.feed.error;

// User orders selectors
export const selectUserOrders = (state: RootState) => state.userOrders.orders;
export const selectUserOrdersLoading = (state: RootState) => state.userOrders.loading;
export const selectUserOrdersError = (state: RootState) => state.userOrders.error;
