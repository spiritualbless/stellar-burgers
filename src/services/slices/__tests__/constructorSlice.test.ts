import reducer, { addBun, addIngredient, removeIngredient, moveIngredient, clearConstructor } from '../constructorSlice';

describe('constructorSlice reducer', () => {
  it('should handle addIngredient', () => {
    const initial = { bun: null, ingredients: [] };
    const ingredient = { id: 'x1', name: 'Начинка', price: 10 } as any;
    const next = reducer(initial, addIngredient(ingredient));
    expect(next.ingredients).toHaveLength(1);
    expect(next.ingredients[0]).toEqual(ingredient);
  });

  it('should handle removeIngredient', () => {
    const initial = { bun: null, ingredients: [{ id: 'x1' }, { id: 'x2' }] } as any;
    const next = reducer(initial, removeIngredient('x1'));
    expect(next.ingredients).toEqual([{ id: 'x2' }]);
  });

  it('should handle moveIngredient', () => {
    const initial = { bun: null, ingredients: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] } as any;
    const next = reducer(initial, moveIngredient({ dragIndex: 0, hoverIndex: 2 }));
    expect(next.ingredients.map((i: any) => i.id)).toEqual(['b', 'c', 'a']);
  });

  it('should handle addBun and clearConstructor', () => {
    const bun = { _id: 'bun-1', name: 'Булка', price: 50 } as any;
    const withBun = reducer(undefined, addBun(bun));
    expect(withBun.bun).toEqual(bun);
    const cleared = reducer(withBun, clearConstructor());
    expect(cleared).toEqual({ bun: null, ingredients: [] });
  });
});


