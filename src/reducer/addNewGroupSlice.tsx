import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout } from "./firebaseSlice";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { RootState } from "./store";
type IAddNewGroupBoardInitialState = {
  boardName: string | undefined;
  status: "idle" | "loading" | "succeeded" | "failed";
  authentication: string | undefined;
  status2: "idle" | "loading" | "succeeded" | "failed";
};
export type Idata = {
  name?: string;
};
const addNewGroupBoardInitialState: IAddNewGroupBoardInitialState = {
  boardName: "",
  status: "idle",
  authentication: "",
  status2: "idle",
};

export const addGroupBoard = createAsyncThunk<
  void,
  Idata,
  { state: RootState }
>("fetch/addGroupBoard", async (data, { getState }) => {
  const state = getState();
  try {
    const groupBoardCollection = collection(db, "group-boards");
    const groupDoc = await addDoc(groupBoardCollection, data);
    const seletGroupDoc = doc(groupBoardCollection, groupDoc.id);
    const updateGroupDoc = await updateDoc(seletGroupDoc, {
      id: groupDoc.id,
      created: state.addNewGroupBoard.authentication,
    });

    return updateGroupDoc;
  } catch (error) {
    console.log("ERROR", error);
  }
});

export const addNewGroupBoard = createSlice({
  name: "newGroupBoard",
  initialState: addNewGroupBoardInitialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addGroupBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addGroupBoard.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addGroupBoard.rejected, (state) => {
        state.status = "failed";
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
