import { rootReducer } from '../rootReducer';

describe('rootReducer', () => {
  it('returns initial state for unknown action and undefined state', () => {
    const state = rootReducer(
      undefined as unknown as ReturnType<typeof rootReducer>,
      { type: 'UNKNOWN_ACTION' } as any
    );

    expect(state).toEqual({
      ingredients: expect.any(Object),
      burgerConstructor: expect.any(Object),
      order: expect.any(Object),
      feed: expect.any(Object),
      userOrders: expect.any(Object),
      auth: expect.any(Object)
    });
  });
});


