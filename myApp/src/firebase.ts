// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVGHtIyRt-ErDp58kMjwjIlN0VTFeQgG4",
  authDomain: "klubikompass.firebaseapp.com",
  projectId: "klubikompass",
  storageBucket: "klubikompass.firebasestorage.app",
  messagingSenderId: "729506292451",
  appId: "1:729506292451:web:42a2c9f2e34684f7fc9bd6",
  measurementId: "G-6ZQ1XTJ9EN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);