import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { db, collection, getDocs } from "../firebase/Firebase";
import { login, logout } from "./firebaseSlice";
import { collection, getDocs, onSnapshot, doc } from "../firebase/Firebase";
import { db } from "../firebase/Firebase";
type IGetDataInitialState = {
  data: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  auth: string | undefined;
};
type Inputs = {
  name: string;
};
const getDataInitialState = {
  data: [],
  status: "idle",
  auth: "",
} as IGetDataInitialState;

export const getAllList = createAsyncThunk(
  "getData/fetchGet",
  async (data: Inputs, { getState }) => {
    console.log("geeeeeeeeeeeeet", getState());
    try {
      const state = getState();
      console.log("STATE GET DATA", state.getData);
      if (!state.getData.auth) {
        // Eğer auth değeri yoksa işlemi gerçekleştirme
        return 5;
      }
      const userCardCollection = collection(
        db,
        "users",
        state.getData.auth,
        "lists" // Güncel authentication değerini kullan
      );
      const querySnapshot = await getDocs(userCardCollection);

      const items = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      return items;
    } catch (e) {
      console.log("ERROR:", e);
    }
  }
);

export const getDataSlice = createSlice({
  name: "getData",
  initialState: getDataInitialState,
  reducers: {
    getAuthDetails(state) {
      console.log(state.auth);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        console.log("Reducer çalıştı. Payload:", action.payload);
      })
      .addCase(getAllList.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(login, (state, action) => {
        console.log("ADD CASE2 LOGİN", action.payload);
        state.auth = action.payload;
      })
      .addCase(logout, (state, action) => {
        console.log("ADD CASE2 LOGOUT", action.payload);
        state.auth = undefined;
      });
  },
});

export const { getAuthDetails } = getDataSlice.actions;
