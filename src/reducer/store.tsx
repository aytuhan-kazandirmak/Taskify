import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./firebaseSlice";
import { providerSlice } from "./ProviderSlice";
import { getDataSlice } from "./getDataSlice";
import { addCardSlice } from "./addNewCard";
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    provider: providerSlice.reducer,
    getData: getDataSlice.reducer,
    addCard: addCardSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
