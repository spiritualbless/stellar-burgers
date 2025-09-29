import reducer, { fetchIngredients } from '../ingredientsSlice';
import { AnyAction } from '@reduxjs/toolkit';

describe('ingredientsSlice async lifecycle', () => {
  it('sets loading=true on pending', () => {
    const next = reducer(undefined, { type: fetchIngredients.pending.type } as AnyAction);
    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
  });

  it('stores items and sets loading=false on fulfilled', () => {
    const payload = [{ _id: '1', name: 'A', type: 'bun', price: 1 }];
    const next = reducer(undefined, { type: fetchIngredients.fulfilled.type, payload } as AnyAction);
    expect(next.loading).toBe(false);
    expect(next.items).toEqual(payload);
  });

  it('stores error and sets loading=false on rejected', () => {
    const error = { message: 'boom' } as any;
    const next = reducer(undefined, { type: fetchIngredients.rejected.type, error } as AnyAction);
    expect(next.loading).toBe(false);
    expect(next.error).toBe('boom');
  });
});


