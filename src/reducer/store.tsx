import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./firebaseSlice";
import { getDataSlice } from "./getDataSlice";
import { addCardSlice } from "./addNewCard";
import { createBoardSlice } from "./addNewBoard";
import { providerGroupSlice } from "./ProviderGroupBoards";
import { addGroupListSlice } from "./addNewGroupList";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    getData: getDataSlice.reducer,
    addCard: addCardSlice.reducer,
    addNewBoard: createBoardSlice.reducer,
    addNewGroupBoard: createBoardSlice.reducer,
    providerGroup: providerGroupSlice.reducer,
    addGroupCard: addGroupListSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
