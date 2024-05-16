import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../src/features/user/userSlice'

export const store = configureStore({
    reducer: {
        users: userReducer,
    },
});

export default store;
