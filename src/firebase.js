
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBRFMe9_YKUfhpHkrYgesHuKffPybzJGjU",
  authDomain: "verifyapp-ea796.firebaseapp.com",
  projectId: "verifyapp-ea796",
  storageBucket: "verifyapp-ea796.appspot.com",
  messagingSenderId: "60684165835",
  appId: "1:60684165835:web:9f91477876e990201bb14e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);