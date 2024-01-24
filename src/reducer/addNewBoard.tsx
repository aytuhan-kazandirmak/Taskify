import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { login, logout } from "./firebaseSlice";
import { RootState } from "./store";
type IcreateBoardInitialState = {
  boardName: string | undefined;
  status: "idle" | "loading" | "succeeded" | "failed";
  authentication: string | undefined;
  status2: "idle" | "loading" | "succeeded" | "failed";
};
type Inputs = {
  name: string;
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
  async (data: Idata, { getState }) => {
    try {
      const state = getState();
      console.log("DATAAAAAAAAAAAAAAĞĞĞ", data);
      const boardCollection = collection(
        db,
        data.email || "",
        "group",
        "lists"
      );
      const getDB = await getDocs(boardCollection);

      /***
       * ÖNCELİKLE KULLANICI MAİLİ VAR YOK KONTROLÜNÜ FİRESTORE İÇERİSİDE ARAMAK YERİNE AUTHENTİCATİON TARAFINDA ARA(MODALA GİRİLEN MAİL İLE GİRİŞ YAPMAYI DENE VE VERİ GELİRSE EKLEME İŞLEMİNİ YAP YOK İSE EKLEME İŞLEMİNİ YAPMA)
       * ÜYE EKLEME İŞLEMİ ESNASINDA ÜYENİN VERİ TABANINA EKLENEN VERİYİ DÜZGÜN BİR ŞEKİLDE AYARLA. EKLENEN VERİDEN HİÇBİR ŞEY ANLAŞILMIYOR.
       * YENİ BİR PAGE İÇERİSİNE GRUP BOARDLARI OLARAK EKLE VE ANLIK OLARAK VERİYİ ÇEK. BOARD ÜZERİNDE YAPILAN DEĞİŞİKLİKLER ÜYELERE ANINDA YANSISIN.
       * ÜYE KALDIRMA İŞLEMİNİ EKLE
       */
      const kkk = getDB.forEach((item) => {
        if (!item.data()) {
        }
        return false;
      });
      if (kkk) {
        return console.log("Girdiğiniz mail adresi bulunamadı");
      }
      const addMember = await addDoc(boardCollection, data);
      const itemSelect = doc(boardCollection, addMember.id);
      const guncelle = await updateDoc(itemSelect, {
        person_who_added: state.addNewBoard.authentication,
        auth: state.addNewBoard.authentication,
        boardId: data.boardId,
        big_section: "group",
        section: "lists",
        id: addMember.id,
      });
      // const addMember = await updateDoc(listRef, {
      //   member: arrayUnion(data.email),
      // });
      // return addMember;
      return guncelle;
    } catch (error) {
      console.error("lütfen doğru bir mail girin", error);
    }
  }
);

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
    builder
      .addCase(addNewMember.pending, (state) => {
        state.status2 = "loading";
      })
      .addCase(addNewMember.fulfilled, (state, action) => {
        state.status2 = "succeeded";
      })
      .addCase(addNewMember.rejected, (state) => {
        state.status2 = "failed";
      });
  },
});
