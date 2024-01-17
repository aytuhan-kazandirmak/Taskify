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
  boardId: string | undefined;
}

const providerInitialState: UsersState = {
  loading: "idle",
  error: "",
  authentication: "",
  boardId: "",
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
      state.provider.authentication || "",
      data.boardId.id,
      "lists"
    );

    console.log("STATE BOARD NAME", data.boardId.id);
    const docRef = await addDoc(userAddCardCollection, data);

    const selecetedData = doc(userAddCardCollection, docRef.id);

    const updateSelectedData = await updateDoc(selecetedData, {
      id: docRef.id,
      email: state.provider.authentication || "",
      createdBy: state.provider.authentication || "",
      items: [],
    });
    console.log("ekeleme başarılı");
    return updateSelectedData;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

export const providerSlice = createSlice({
  name: "provider",
  initialState: providerInitialState,
  reducers: {
    getBoardId(state, actions) {
      console.log("BOARD NAME", actions.payload);
      state.boardId = actions.payload;
    },
  },
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

export const { getBoardId } = providerSlice.actions;
