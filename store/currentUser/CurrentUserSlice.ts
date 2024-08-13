/* import { fetchAllUsers } from "@/lib/actions/user.action";
import { UserType } from "@/lib/models/user.model"; */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the fetchUsers async thunk before the createSlice call
/* export const fetchUsers = createAsyncThunk('users/fetchAllUsers', async () => {
    const users = await fetchAllUsers();
    return users;
}); */

const initialState: [] = [];

const currentUsersSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        // Define reducers if needed
    },
    extraReducers(builder) {
        /* builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UserType[]>) => {
            
            return action.payload;
        }); */
    },
});

export const currentUsersReducer = currentUsersSlice.reducer;