import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import { ProtectedRoute } from '../protected-route';
import { getOrderByNumber, clearOrder } from '../../services/slices/orderSlice';
import { selectOrderCache } from '../../services/selectors';

export const ModalRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const currentOrder = useSelector((state) => state.order.currentOrder);
  const background = location.state?.background;

  const handleCloseModal = () => {
    // Clear any viewed order to avoid leaking into other screens
    dispatch(clearOrder());
    navigate(-1);
  };

  const handleIngredientModal = () => {
    return (
      <Modal title="Детали ингредиента" onClose={handleCloseModal}>
        <IngredientDetails />
      </Modal>
    );
  };

  const handleOrderModal = () => {
    return (
      <Modal title="" onClose={handleCloseModal}>
        <OrderInfo order={currentOrder || undefined} />
      </Modal>
    );
  };

  const OrderModalWithData = () => {
    const { number } = useParams<{ number: string }>();
    const lastRequestedNumberRef = useRef<number | null>(null);
    const isLoadingRef = useRef<boolean>(false);
    const orderCache = useSelector(selectOrderCache);
    
    useEffect(() => {
      if (number) {
        const targetNumber = parseInt(number);
        const currentNumber = currentOrder?.number;
        
        // Check if order is in cache first
        const cachedOrder = orderCache[targetNumber];
        
        // Only fetch if:
        // 1. We don't have the order data yet (neither current nor cached)
        // 2. The current order is different from the requested one
        // 3. We haven't already requested this number
        // 4. We're not currently loading
        if (!cachedOrder && 
            currentNumber !== targetNumber && 
            lastRequestedNumberRef.current !== targetNumber && 
            !isLoadingRef.current) {
          lastRequestedNumberRef.current = targetNumber;
          isLoadingRef.current = true;
          dispatch(getOrderByNumber(targetNumber)).finally(() => {
            isLoadingRef.current = false;
          });
        }
      }
      
      return () => {
        // Don't clear order on unmount to avoid flickering
        // The order will be cleared when modal is closed
      };
    }, [dispatch, number, orderCache]);

    return handleOrderModal();
  };

  return (
    <>
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={handleIngredientModal()}
          />
          <Route
            path="/feed/:number"
            element={<OrderModalWithData />}
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderModalWithData />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
