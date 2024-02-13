import { createSlice } from "@reduxjs/toolkit";
type TState = {
  loading: boolean;
  userDetails: string;
  error: null;
  success: boolean;
};
const authInitialState: TState = {
  loading: false,
  userDetails: "",
  error: null,
  success: false,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: authInitialState,
  reducers: {
    login(state, actions) {
      state.userDetails = actions.payload;
    },
    logout(state) {
      state.userDetails = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
