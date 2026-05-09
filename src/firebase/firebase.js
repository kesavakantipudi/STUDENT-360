import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAFldBP95ODLxgC-IZEctBP2bSZDdlIGp0",
    authDomain: "student-360-962c4.firebaseapp.com",
    projectId: "student-360-962c4",
    appId: "1:127075135949:web:0d580d63198ec1268ad484"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);