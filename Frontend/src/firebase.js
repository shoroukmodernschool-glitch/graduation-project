
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWI4Ghjq1ODp1zosDQg3ZVWXbkHFRCCso",
  authDomain: "shorouk-modern-school.firebaseapp.com",
  projectId: "shorouk-modern-school",
  storageBucket: "shorouk-modern-school.firebasestorage.app",
  messagingSenderId: "536304123227",
  appId: "1:536304123227:web:d96e48cf1d7c4211f7ee7e",
  measurementId: "G-QFJN6DTDT7"
};

const app = initializeApp(firebaseConfig);

/* Firestore */
export const db = getFirestore(app);

/* Authentication */
export const auth = getAuth(app);
