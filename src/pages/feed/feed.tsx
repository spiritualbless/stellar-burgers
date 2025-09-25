import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectFeedOrders, selectFeedLoading } from '../../services/selectors';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { getOrderByNumber } from '../../services/slices/orderSlice';
import { OrderInfo } from '../../components/order-info';

export const Feed: FC = () => {
  const { number } = useParams<{ number?: string }>();
  const location = useLocation();
  const background = location.state as { background?: Location } | null;
  const ordersData = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!number) {
      // Otherwise load the general feed list
      dispatch(fetchFeeds());
    } else if (!background?.background) {
      // Direct navigation to order page (not a modal over background)
      dispatch(getOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number, background?.background]);

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
