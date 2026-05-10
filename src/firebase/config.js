// Firebase configuration
// Replace with your actual Firebase project config
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFACYAvfLRnTlqX4lUtMfCWnV05pEh8-s",
  authDomain: "student-360-ccb4e.firebaseapp.com",
  projectId: "student-360-ccb4e",
  storageBucket: "student-360-ccb4e.firebasestorage.app",
  messagingSenderId: "999131718001",
  appId: "1:999131718001:web:f2cb800591ab8c459f96d0",
  measurementId: "G-3CPXYJDLPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);