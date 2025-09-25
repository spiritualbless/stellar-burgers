import { FC, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { 
  selectConstructorBun, 
  selectConstructorIngredients, 
  selectConstructorTotal,
  selectOrderLoading,
  selectOrderNumber,
  selectIsAuthenticated
} from '../../services/selectors';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const price = useAppSelector(selectConstructorTotal);
  const orderRequest = useAppSelector(selectOrderLoading);
  const orderNumber = useAppSelector(selectOrderNumber);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  console.log('BurgerConstructor: bun =', bun);
  console.log('BurgerConstructor: ingredients =', ingredients);
  console.log('BurgerConstructor: ingredients type =', typeof ingredients);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const autoSubmitGuardRef = useRef(false);

  const constructorItems = {
    bun,
    ingredients: ingredients || []
  };

  const onOrderClick = () => {
    if (!bun || orderRequest) return;
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/', intent: 'placeOrder' } });
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...(ingredients || []).map((ingredient: any) => ingredient._id),
      bun._id
    ];
    
    dispatch(createOrder(ingredientsIds));
  };

  useEffect(() => {
    // After successful login redirect back to '/', auto-submit the order once
    const shouldPlaceOrder = (location.state as any)?.intent === 'placeOrder';
    if (
      shouldPlaceOrder &&
      isAuthenticated &&
      bun &&
      !orderRequest &&
      !autoSubmitGuardRef.current
    ) {
      autoSubmitGuardRef.current = true;
      const ingredientsIds = [
        bun._id,
        ...(ingredients || []).map((ingredient: any) => ingredient._id),
        bun._id
      ];
      dispatch(createOrder(ingredientsIds));
      // Clear state to prevent re-trigger on re-renders
      navigate('/', { replace: true });
    }
  }, [location.state, isAuthenticated, bun, orderRequest, ingredients, dispatch, navigate]);

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderNumber={orderNumber}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
