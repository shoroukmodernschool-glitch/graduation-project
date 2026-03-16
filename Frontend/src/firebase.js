import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

export const db = getFirestore(app);