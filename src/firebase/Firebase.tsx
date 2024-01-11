import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA4n3pNpgUZSPCLBEpx2Mgw6XCPK5UHAtQ",
  authDomain: "taskify-43776.firebaseapp.com",
  projectId: "taskify-43776",
  storageBucket: "taskify-43776.appspot.com",
  messagingSenderId: "981326637914",
  appId: "1:981326637914:web:d8860b99a1983525a7a163",
};

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);
export {
  app,
  createUserWithEmailAndPassword,
  auth,
  signInWithEmailAndPassword,
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
};
