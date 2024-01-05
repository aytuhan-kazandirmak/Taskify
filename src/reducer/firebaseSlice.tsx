import { createSlice } from "@reduxjs/toolkit";
type TState = {
  loading: boolean;
  userDetails: null;
  error: null;
  success: boolean;
};
const initialState: TState = {
  loading: false,
  userDetails: null,
  error: null,
  success: false,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    login(state, actions) {
      state.userDetails = actions.payload;
      console.log("userdtaalllss", state.userDetails);
    },
    logout(state) {
      state.userDetails = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
