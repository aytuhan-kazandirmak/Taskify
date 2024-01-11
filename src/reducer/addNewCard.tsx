import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout } from "./firebaseSlice";
import {
  db,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
} from "../firebase/Firebase";
import { arrayUnion } from "firebase/firestore";
import { RootState } from "./store";
interface UsersState {
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
  authentication: string | undefined;
}

type Idata = {
  name: string;
  parentId: string;
};

const initialCardState = {
  loading: "idle",
  error: "",
  authentication: "",
} as UsersState;

export const addNewCard = createAsyncThunk<void, Idata, { state: RootState }>(
  "post/addCard",
  async (data, { getState }) => {
    const state = getState();
    console.log("PARENT ID", data.parentId);
    try {
      const userAddCardCollection = collection(
        db,
        "users",
        state.addCard.authentication,
        "lists"
      );
      let chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let str = "";
      for (let i = 0; i < 20; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      console.log("STR", str);
      const selectList = doc(userAddCardCollection, data.parentId);
      const newData = {
        ...data,
        id: `${str}`,
        createdBy: state.addCard.authentication,
      };
      const updateCardList = await updateDoc(selectList, {
        items: arrayUnion(newData),
      });
      console.log("SEÇİLEN DATA", selectList);

      // Rastgele karakter seçimi
    } catch (error) {
      console.log("ERROR", error);
    }
  }
);

export const addCardSlice = createSlice({
  name: "addCard",
  initialState: initialCardState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addNewCard.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(addNewCard.fulfilled, (state: any) => {
        state.loading = "succeeded";
        // state.newList.push(action.payload);
      })
      .addCase(addNewCard.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(login, (state, action) => {
        state.authentication = action.payload;
      })
      .addCase(logout, (state) => {
        state.authentication = undefined;
      });
  },
});

export const {} = addCardSlice.actions;
