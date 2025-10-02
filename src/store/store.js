import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../users/fetchUser";

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export default store;
