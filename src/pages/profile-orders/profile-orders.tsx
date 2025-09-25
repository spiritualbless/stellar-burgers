import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectUserOrders, selectUserOrdersLoading } from '../../services/selectors';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { getOrderByNumber } from '../../services/slices/orderSlice';
import { OrderInfo } from '../../components/order-info';

export const ProfileOrders: FC = () => {
  const { number } = useParams<{ number?: string }>();
  const location = useLocation();
  const background = location.state as { background?: Location } | null;
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectUserOrdersLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrders());
    if (number && !background?.background) {
      // Only fetch order details on direct navigation, not when shown as a modal
      dispatch(getOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number, background?.background]);

  if (loading) {
    return null;
  }

  if (number) {
    return <OrderInfo />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
