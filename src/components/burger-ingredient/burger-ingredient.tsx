import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/store';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { TIngredient } from '../../utils/types';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';
import { selectConstructorBun, selectConstructorIngredients } from '../../services/selectors';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    
    const bun = useAppSelector(selectConstructorBun);
    const ingredients = useAppSelector(selectConstructorIngredients);

    console.log('BurgerIngredient:', ingredient.name, 'ingredients =', ingredients);

    const actualCount = useMemo(() => {
      if (ingredient.type === 'bun') {
        return bun?._id === ingredient._id ? 2 : 0;
      }
      return (ingredients || []).filter((item: any) => item._id === ingredient._id).length;
    }, [ingredient, bun, ingredients]);

    const handleAdd = () => {
      console.log('BurgerIngredient: handleAdd called with ingredient:', ingredient);
      try {
        if (ingredient.type === 'bun') {
          // Store bun as-is; replacement handled in reducer
          dispatch(addBun(ingredient));
        } else {
          const ingredientData = { ...ingredient, id: `${ingredient._id}-${Date.now()}` };
          console.log('BurgerIngredient: dispatching addIngredient with:', ingredientData);
          dispatch(addIngredient(ingredientData));
        }
      } catch (error) {
        console.error('BurgerIngredient: Error in handleAdd:', error);
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={actualCount}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
