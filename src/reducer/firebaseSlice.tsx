import { createSlice } from "@reduxjs/toolkit";
import { IUserInformation } from "../components/kanban/commonTypes";

type TState = {
  loading: boolean;
  userDetails: string;
  userInformation: IUserInformation | undefined;
  error: null;
  success: boolean;
};
const authInitialState: TState = {
  loading: false,
  userDetails: "",
  userInformation: undefined,
  error: null,
  success: false,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: authInitialState,
  reducers: {
    login(state, actions) {
      state.userDetails = actions.payload;
      console.log("123", state.userDetails);
    },
    logout(state) {
      state.userDetails = "";
      localStorage.removeItem("userInformation");
    },
    onAuthState(state, actions) {
      state.userInformation = actions.payload;
      console.log(actions.payload);
      console.log("state userinformation", state.userInformation);
    },
  },
});

export const { login, logout, onAuthState } = authSlice.actions;
