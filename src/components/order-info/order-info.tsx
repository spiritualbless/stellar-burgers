import { FC, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { ErrorMessage } from '../ui/error-message';
import { TIngredient, TOrder } from '../../utils/types';
import { selectIngredients, selectCurrentOrder, selectOrderLoading, selectOrderError } from '../../services/selectors';
import { getOrderByNumber } from '../../services/slices/orderSlice';

interface OrderInfoProps {
  order?: TOrder;
}

export const OrderInfo: FC<OrderInfoProps> = ({ order }) => {
  const orderData = useSelector(selectCurrentOrder) || order;
  const ingredients = useSelector(selectIngredients);
  const orderLoading = useSelector(selectOrderLoading);
  const orderError = useSelector(selectOrderError);
  const dispatch = useDispatch();

  const handleRetry = () => {
    if (orderData?.number) {
      dispatch(getOrderByNumber(orderData.number));
    }
  };

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: any) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing: any) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: any) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Show loading only when we're actually loading and don't have order data
  if (orderLoading && !orderData) {
    return <Preloader />;
  }

  // Show error if there's an error and no order data
  if (orderError && !orderData) {
    return <ErrorMessage message={orderError} onRetry={handleRetry} />;
  }

  // Show loading if we have order data but ingredients are still loading
  if (orderData && (!ingredients || ingredients.length === 0)) {
    return <Preloader />;
  }

  // Show error if we have order data but can't process it due to missing ingredients
  if (orderData && ingredients && ingredients.length === 0) {
    return <ErrorMessage message="Ошибка загрузки ингредиентов" />;
  }

  if (!orderInfo) {
    return <ErrorMessage message="Заказ не найден" />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
