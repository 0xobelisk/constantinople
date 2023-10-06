import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

let store = createStore(
  reducers,
  applyMiddleware(thunk)
);

export default store;

// import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import reducers from './reducers';

// export const store = configureStore({
//   reducer: reducers
// });

// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;
