// Import الأساسيات
import { initializeApp } from "firebase/app";

// Services
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Config بتاع مشروعك
const firebaseConfig = {
  apiKey: "AIzaSyCWI4Ghjq1ODp1zosDQg3ZVWXbkHFRCCso",
  authDomain: "shorouk-modern-school.firebaseapp.com",
  projectId: "shorouk-modern-school",
  storageBucket: "shorouk-modern-school.firebasestorage.app",
  messagingSenderId: "536304123227",
  appId: "1:536304123227:web:d96e48cf1d7c4211f7ee7e",
  measurementId: "G-QFJN6DTDT7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export them
export { db, auth, storage };