import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectFeedOrders, selectFeedLoading } from '../../services/selectors';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { getOrderByNumber } from '../../services/slices/orderSlice';
import { OrderInfo } from '../../components/order-info';

export const Feed: FC = () => {
  const { number } = useParams<{ number?: string }>();
  const ordersData = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
    if (number) {
      dispatch(getOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading || !ordersData) {
    return <Preloader />;
  }

  if (number) {
    return <OrderInfo />;
  }

  return <FeedUI orders={ordersData.orders} handleGetFeeds={handleGetFeeds} />;
};
