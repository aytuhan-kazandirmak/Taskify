import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db, collection, addDoc, doc, updateDoc } from "../firebase/Firebase";
import { RootState } from "./store";
import { login, logout } from "./firebaseSlice";

type Inputs = {
  name: string;
};

interface UsersState {
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
  authentication: string | undefined;
}

const providerInitialState: UsersState = {
  loading: "idle",
  error: "",
  authentication: "",
};

export const createNewList = createAsyncThunk<
  void,
  Inputs,
  { state: RootState }
>("posts/fetchPosts", async (data, { getState }) => {
  const state = getState();
  try {
    const userAddCardCollection = collection(
      db,
      "users",
      state.provider.authentication || "", // null ya da undefined durumlarına karşı kontrol ekleyin
      "lists"
    );

    const docRef = await addDoc(userAddCardCollection, data);

    const selecetedData = doc(userAddCardCollection, docRef.id);
    console.log("SELECETED DATA PROVİDER", selecetedData);

    const updateSelectedData = await updateDoc(selecetedData, {
      id: docRef.id,
      email: state.provider.authentication || "", // null ya da undefined durumlarına karşı kontrol ekleyin
      createdBy: state.provider.authentication || "", // null ya da undefined durumlarına karşı kontrol ekleyin
      items: [],
    });

    return updateSelectedData;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

export const providerSlice = createSlice({
  name: "provider",
  initialState: providerInitialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createNewList.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(createNewList.fulfilled, (state) => {
        state.loading = "succeeded";
        // state.newList.push(action.payload);
      })
      .addCase(createNewList.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error?.message; // action.error kontrolü ekleyin
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

export const {} = providerSlice.actions;
