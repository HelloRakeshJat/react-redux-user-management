import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    users: [],
    status: 'idle',
    error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        userAdded: (state, action) => {
            state.users.push(action.payload);
        },
        userUpdated: (state, action) => {
            const { id, name, email, phone, address } = action.payload;
            const existingUser = state.users.find((user) => user.id === id);
            if (existingUser) {
                existingUser.name = name;
                existingUser.email = email;
                existingUser.phone = phone;
                existingUser.address = address;
            }
        },
        userDeleted: (state, action) => {
            const { id } = action.payload;
            state.users = state.users.filter((user) => user.id !== id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { userAdded, userUpdated, userDeleted } = userSlice.actions;

export default userSlice.reducer;
