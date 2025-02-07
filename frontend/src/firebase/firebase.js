// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLCes_jTuZvz9CAykCTciFv5UMJ7MZIAk",
  authDomain: "bigdocs-8e195.firebaseapp.com",
  projectId: "bigdocs-8e195",
  storageBucket: "bigdocs-8e195.firebasestorage.app",
  messagingSenderId: "184219646245",
  appId: "1:184219646245:web:6006375dab48c83f1202cc",
  measurementId: "G-9VDTD76EB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);