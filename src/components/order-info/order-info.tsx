import { FC, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '../../utils/types';
import { selectIngredients, selectCurrentOrder, selectOrderLoading, selectOrderError } from '../../services/selectors';

interface OrderInfoProps {
  order?: TOrder;
}

export const OrderInfo: FC<OrderInfoProps> = ({ order }) => {
  const orderData = useSelector(selectCurrentOrder) || order;
  const ingredients = useSelector(selectIngredients);
  const orderLoading = useSelector(selectOrderLoading);
  const orderError = useSelector(selectOrderError);

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

  if (orderLoading || (!orderInfo && (!ingredients || ingredients.length === 0))) {
    return <Preloader />;
  }

  if (!orderInfo) {
    // Only show error text if we truly have no data
    return <div className="text text_type_main-default p-6">{orderError ? 'Ошибка загрузки заказа' : 'Заказ не найден'}</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
