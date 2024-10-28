import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './features/tasksSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

export default store; // Make sure you're using the default export
