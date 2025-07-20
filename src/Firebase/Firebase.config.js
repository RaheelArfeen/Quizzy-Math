// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD_JOdr3RoM25Lu5yfENp9ipYDyKEZNSz8',
  authDomain: 'quizzymath-3a548.firebaseapp.com',
  projectId: 'quizzymath-3a548',
  storageBucket: 'quizzymath-3a548.firebasestorage.app',
  messagingSenderId: '747028318678',
  appId: '1:747028318678:web:531b65b2c72b8ce31d7c7',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app