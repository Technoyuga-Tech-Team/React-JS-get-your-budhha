import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../Reducer/index';

const store = configureStore({
    reducer: rootReducer,
  }); // Create your Redux store with combined reducers

export default store;
