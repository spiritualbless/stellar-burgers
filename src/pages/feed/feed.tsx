import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectFeedOrders, selectFeedLoading } from '../../services/selectors';
import { fetchFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const ordersData = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading || !ordersData) {
    return <Preloader />;
  }

  return <FeedUI orders={ordersData.orders} handleGetFeeds={handleGetFeeds} />;
};
