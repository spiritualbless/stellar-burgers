import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectFeedOrders, selectFeedLoading, selectCurrentOrder, selectOrderCache } from '../../services/selectors';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { getOrderByNumber } from '../../services/slices/orderSlice';
import { OrderInfo } from '../../components/order-info';

export const Feed: FC = () => {
  const { number } = useParams<{ number?: string }>();
  const location = useLocation();
  const background = location.state as { background?: Location } | null;
  const ordersData = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);
  const currentOrder = useSelector(selectCurrentOrder);
  const orderCache = useSelector(selectOrderCache);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!number) {
      // Load the general feed list only if we don't have data yet
      if (!ordersData) {
        dispatch(fetchFeeds());
      }
    } else if (!background?.background) {
      // Direct navigation to order page (not a modal over background)
      const targetNumber = parseInt(number);
      const cachedOrder = orderCache[targetNumber];
      
      // Only fetch if we don't already have this order (neither current nor cached)
      if (!cachedOrder && (!currentOrder || currentOrder.number !== targetNumber)) {
        dispatch(getOrderByNumber(targetNumber));
      }
    }
  }, [dispatch, number, background?.background, ordersData, currentOrder, orderCache]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (number) {
    return <OrderInfo />;
  }

  if (loading || !ordersData) {
    return <Preloader />;
  }

  return <FeedUI orders={ordersData.orders} handleGetFeeds={handleGetFeeds} />;
};
