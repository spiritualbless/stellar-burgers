import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useAppDispatch } from '../../services/store';
import { selectUser, selectAuthLoading, selectAuthError } from '../../services/selectors';
import { updateUser, clearError } from '../../services/slices/authSlice';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const dispatch = useAppDispatch();

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Показываем успешное обновление и очищаем пароль после успешного обновления
  useEffect(() => {
    if (user && !loading && !error && showSuccess) {
      setFormValue((prevState) => ({
        ...prevState,
        password: ''
      }));
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, error, showSuccess]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    const updateData: any = {
      name: formValue.name,
      email: formValue.email
    };
    if (formValue.password) {
      updateData.password = formValue.password;
    }
    
    dispatch(updateUser(updateData)).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setShowSuccess(true);
      }
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      dispatch(clearError());
    }
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error || undefined}
      showSuccess={showSuccess}
    />
  );
};
