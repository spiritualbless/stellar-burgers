import { useSelector, useDispatch } from '../../services/store';
import { selectIngredientsLoading } from '../../services/selectors';
import { useParams } from 'react-router-dom';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { IngredientDetails } from '../../components/ingredient-details';
import { FC, useEffect } from 'react';

export const ConstructorPage: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  console.log('ConstructorPage: isIngredientsLoading =', isIngredientsLoading);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (id) {
    return (
      <main className={styles.containerMain}>
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Детали ингредиента
        </h1>
        <div className={`${styles.main} pl-5 pr-5`}>
          <IngredientDetails />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
