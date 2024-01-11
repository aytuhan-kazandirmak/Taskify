import { createSlice } from "@reduxjs/toolkit";
type TState = {
  loading: boolean;
  userDetails: string | undefined;
  error: null;
  success: boolean;
};
const authInitialState: TState = {
  loading: false,
  userDetails: undefined,
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
      state.userDetails = undefined;
    },
  },
});

export const { login, logout } = authSlice.actions;
