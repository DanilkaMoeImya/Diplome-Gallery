import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyChJk3FSqABrpP2ZmWt3xSDDyAHhe-Lvgo",
    authDomain: "escobiochat.firebaseapp.com",
    projectId: "escobiochat",
    storageBucket: "escobiochat.appspot.com",
    messagingSenderId: "992840918778",
    appId: "1:992840918778:web:cf14b1a4f992b71f868b43",
};

const app = getApp.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);

export { app, firebaseAuth, firestoreDB };