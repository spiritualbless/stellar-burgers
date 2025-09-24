import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectUserOrders, selectUserOrdersLoading } from '../../services/selectors';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { getOrderByNumber } from '../../services/slices/orderSlice';
import { OrderInfo } from '../../components/order-info';

export const ProfileOrders: FC = () => {
  const { number } = useParams<{ number?: string }>();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectUserOrdersLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrders());
    if (number) {
      dispatch(getOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number]);

  if (loading) {
    return null;
  }

  if (number) {
    return <OrderInfo />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
