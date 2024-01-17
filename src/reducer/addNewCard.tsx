import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout } from "./firebaseSlice";
import { db, collection, doc, updateDoc } from "../firebase/Firebase";
import { arrayUnion } from "firebase/firestore";
import { RootState } from "./store";

interface UsersState {
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
  authentication: string | undefined;
}

interface Idata {
  name: string;
  parentId: string; // parentId tipi belirtildi
}

const initialCardState: UsersState = {
  loading: "idle",
  error: "",
  authentication: "",
};

export const addNewCard = createAsyncThunk<void, Idata, { state: RootState }>(
  "post/addCard",
  async (data, { getState }) => {
    const state = getState();
    console.log("PARENT ID", data.parentId);
    try {
      const userAddCardCollection = collection(
        db,
        state.addCard.authentication || "",
        data.boardId.id, // null ya da undefined durumlarına karşı kontrol ekledim
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
        createdBy: state.addCard.authentication || "", // null ya da undefined durumlarına karşı kontrol ekledim
      };
      const updateCardList = await updateDoc(selectList, {
        items: arrayUnion(newData),
      });
      console.log("SEÇİLEN DATA", selectList);
      return updateCardList;
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
      .addCase(addNewCard.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(addNewCard.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error?.message; // action.error kontrolü ekledim
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
