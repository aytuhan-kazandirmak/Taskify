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

export const createNewGroupList = createAsyncThunk<
  void,
  Inputs,
  { state: RootState }
>("posts/fetchGroupPosts", async (data, { getState }) => {
  const state = getState();
  console.log("AKAAAAAAAAAAAAAA", data);
  try {
    const userAddCardCollection = collection(
      db,
      "group-boards",
      data.boardId,
      "lists"
    );

    console.log("STATE BOARD NAME", data.boardId.id);
    const docRef = await addDoc(userAddCardCollection, data);

    const selecetedData = doc(userAddCardCollection, docRef.id);

    const updateSelectedData = await updateDoc(selecetedData, {
      id: docRef.id,
      email: state.providerGroup.authentication || "",
      createdBy: state.providerGroup.authentication || "",
      items: [],
    });
    console.log("ekeleme başarılı");
    return updateSelectedData;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

export const providerGroupSlice = createSlice({
  name: "provider",
  initialState: providerInitialState,
  reducers: {
    getGroupBoardId(state, actions) {
      console.log("BOARD NAME", actions.payload);
      state.boardId = actions.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createNewGroupList.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(createNewGroupList.fulfilled, (state) => {
        state.loading = "succeeded";
        // state.newList.push(action.payload);
      })
      .addCase(createNewGroupList.rejected, (state, action) => {
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

export const { getGroupBoardId } = providerGroupSlice.actions;
