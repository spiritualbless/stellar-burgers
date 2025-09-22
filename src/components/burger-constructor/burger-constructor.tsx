import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { 
  selectConstructorBun, 
  selectConstructorIngredients, 
  selectConstructorTotal,
  selectOrderLoading,
  selectCurrentOrder,
  selectIsAuthenticated
} from '../../services/selectors';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const price = useAppSelector(selectConstructorTotal);
  const orderRequest = useAppSelector(selectOrderLoading);
  const orderModalData = useAppSelector(selectCurrentOrder);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  console.log('BurgerConstructor: bun =', bun);
  console.log('BurgerConstructor: ingredients =', ingredients);
  console.log('BurgerConstructor: ingredients type =', typeof ingredients);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const constructorItems = {
    bun,
    ingredients: ingredients || []
  };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...(ingredients || []).map((ingredient: any) => ingredient._id),
      bun._id
    ];
    
    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
