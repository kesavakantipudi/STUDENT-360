import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFACYAvfLRnTlqX4lUtMfCWnV05pEh8-s",
  authDomain: "student-360-ccb4e.firebaseapp.com",
  projectId: "student-360-ccb4e",
  storageBucket: "student-360-ccb4e.firebasestorage.app",
  messagingSenderId: "999131718001",
  appId: "1:999131718001:web:f2cb800591ab8c459f96d0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);


