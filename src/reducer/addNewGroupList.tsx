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

export interface Idata {
  name?: string;
  parentId?: string; // parentId tipi belirtildi
  boardId?: string;
}

const initialCardState: UsersState = {
  loading: "idle",
  error: "",
  authentication: "",
};

export const addNewGroupCard = createAsyncThunk<
  void,
  Idata,
  { state: RootState }
>("post/addCard", async (data, { getState }) => {
  const state = getState();

  try {
    const userAddCardCollection = collection(
      db,
      "group-boards",
      data.boardId || "",
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
      createdBy: state.auth.userDetails || "", // null ya da undefined durumlarına karşı kontrol ekledim
    };
    const updateCardList = await updateDoc(selectList, {
      items: arrayUnion(newData),
    });
    return updateCardList;
  } catch (error) {
    console.log("ERROR", error);
  }
});

export const addGroupListSlice = createSlice({
  name: "addCard",
  initialState: initialCardState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addNewGroupCard.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(addNewGroupCard.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(addNewGroupCard.rejected, (state, action) => {
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
