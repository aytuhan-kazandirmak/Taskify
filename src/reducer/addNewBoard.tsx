import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { login, logout } from "./firebaseSlice";
import { RootState } from "./store";
type IcreateBoardInitialState = {
  boardName: string | undefined;
  status: "idle" | "loading" | "succeeded" | "failed";
  authentication: string | undefined;
};
type Inputs = {
  name: string;
};
const createBoardInitialState: IcreateBoardInitialState = {
  boardName: "",
  status: "idle",
  authentication: "",
};
export const createNewField = createAsyncThunk<
  void,
  Inputs,
  { state: RootState }
>("fetch/addBoard", async (data, { getState }) => {
  const state = getState();
  try {
    const boardCollection = collection(
      db,
      state.addNewBoard.authentication || ""
    );
    const docRef = await addDoc(boardCollection, data);
    console.log("docref id", docRef.id);
    const selectBoard = doc(boardCollection, docRef.id);
    const updateBoard = await updateDoc(selectBoard, {
      id: docRef.id,
    });
    return updateBoard;
  } catch (error) {
    console.log("ERROR", error);
  }
});

export const createBoardSlice = createSlice({
  name: "createBoard",
  initialState: createBoardInitialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createNewField.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNewField.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createNewField.rejected, (state) => {
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
