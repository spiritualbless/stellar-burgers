import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import { ProtectedRoute } from '../protected-route';
import { getOrderByNumber, clearOrder } from '../../services/slices/orderSlice';

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
    
    useEffect(() => {
      if (number) {
        // Avoid duplicate fetching if current order is already the requested one
        const currentNumber = currentOrder?.number;
        const targetNumber = parseInt(number);
        const alreadyRequested = lastRequestedNumberRef.current === targetNumber;
        if (currentNumber !== targetNumber && !alreadyRequested) {
          lastRequestedNumberRef.current = targetNumber;
          dispatch(getOrderByNumber(targetNumber));
        }
      }
      return () => {
        // Cleanup viewed order on unmount
        dispatch(clearOrder());
      };
    }, [dispatch, number, currentOrder?.number]);

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
