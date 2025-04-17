// Import the functions you need from the SDKs you need
import { initializeApp, getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth"
import {getFirestore} from "firebase/firestore"



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhXdjlv2YzbB9Ib-pQ7ZiBEgDS6bICWDk",
  authDomain: "stackprep-765d3.firebaseapp.com",
  projectId: "stackprep-765d3",
  storageBucket: "stackprep-765d3.firebasestorage.app",
  messagingSenderId: "1086581137700",
  appId: "1:1086581137700:web:0e5f6fc396ad4d949413b1",
  measurementId: "G-215SMJF3VV"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp();


export const auth =getAuth(app)
export const db = getFirestore(app)