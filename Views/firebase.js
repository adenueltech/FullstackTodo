// firebase.js

// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // if you're using Firestore
import { getAuth } from "firebase/auth"; // if you're using Auth

// Your web app's Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC-IsG4dwEy-ltokfbbMlGp8JHf9Y-lWiM",
  authDomain: "nueltodoapp.firebaseapp.com",
  projectId: "nueltodoapp",
  storageBucket: "nueltodoapp.appspot.com",
  messagingSenderId: "455131490282",
  appId: "1:455131490282:web:455388c72afbc323b0f493",
  measurementId: "G-PFKKWQEDHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // if using Firestore
const auth = getAuth(app); // if using Firebase Auth

// Export if needed (for modular frontend JS setups like ES Modules)
export { db, auth };
