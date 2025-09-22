import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import { ProtectedRoute } from '../protected-route';
import { getOrderByNumber } from '../../services/slices/orderSlice';

export const ModalRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const currentOrder = useSelector((state) => state.order.currentOrder);
  const background = location.state?.background;

  const handleCloseModal = () => {
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
    
    useEffect(() => {
      if (number) {
        dispatch(getOrderByNumber(parseInt(number)));
      }
    }, [dispatch, number]);

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
