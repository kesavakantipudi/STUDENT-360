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
  apiKey: "AIzaSyAFldBP95ODLxgC-IZEctBP2bSZDdlIGp0",
  authDomain: "student-360-962c4.firebaseapp.com",
  projectId: "student-360-962c4",
  storageBucket: "student-360-962c4.firebasestorage.app",
  messagingSenderId: "127075135949",
  appId: "1:127075135949:web:0d580d63198ec1268ad484",
  measurementId: "G-Y4FZ915EQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);