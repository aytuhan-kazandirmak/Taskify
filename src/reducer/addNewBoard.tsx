import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { login, logout } from "./firebaseSlice";

type IcreateBoardInitialState = {
  boardName: string | undefined;
  status: "idle" | "loading" | "succeeded" | "failed";
  authentication: string | undefined;
  status2: "idle" | "loading" | "succeeded" | "failed";
};

const createBoardInitialState: IcreateBoardInitialState = {
  boardName: "",
  status: "idle",
  authentication: "",
  status2: "idle",
};
type Idata = { email: string; boardId: string };
export const addNewMember = createAsyncThunk(
  "fetch/addMember",
  async (data: Idata) => {
    try {
      const grupBoardsCollection = collection(db, "group-boards");
      const selectItem = doc(grupBoardsCollection, data.boardId);
      const addNewMembers = await updateDoc(selectItem, {
        member: arrayUnion(data.email),
      });
      return addNewMembers;
    } catch (error) {
      console.error("lütfen doğru bir mail girin", error);
    }
  }
);

export const createBoardSlice = createSlice({
  name: "createBoard",
  initialState: createBoardInitialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(login, (state, action) => {
        state.authentication = action.payload;
      })
      .addCase(logout, (state) => {
        state.authentication = undefined;
      });
    builder
      .addCase(addNewMember.pending, (state) => {
        state.status2 = "loading";
      })
      .addCase(addNewMember.fulfilled, (state) => {
        state.status2 = "succeeded";
      })
      .addCase(addNewMember.rejected, (state) => {
        state.status2 = "failed";
      });
  },
});
