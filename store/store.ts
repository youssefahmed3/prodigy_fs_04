import { configureStore } from "@reduxjs/toolkit";
import { currentUsersReducer } from "./currentUser/CurrentUserSlice";
import { messagesReducer } from "./messages/MessagesSlice";
import { groupsReducer } from "./groups/GroupsSlice";
export const store = configureStore({
    reducer: {
        currentUsers: currentUsersReducer,
        messagesSlice: messagesReducer,
        groupsSlice: groupsReducer
    },
})

export type RootState = ReturnType<typeof store.getState>; // to get all the states in the store by using this type

export type AppDispatch = typeof store.dispatch; // for async actions

