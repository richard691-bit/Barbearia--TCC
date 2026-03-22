// firebaseConfig.js — Configuração e inicialização do Firebase
 
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
 
const firebaseConfig = {
    apiKey: "AIzaSyASQoUcoY87PZYASqaKqhYtrtroQ0YiHnk",
    authDomain: "databasebarbearia.firebaseapp.com",
    projectId: "databasebarbearia",
    storageBucket: "databasebarbearia.firebasestorage.app",
    messagingSenderId: "579297265392",
    appId: "1:579297265392:web:3528dfc37a4b29fef8e435"
};
 
const app = initializeApp(firebaseConfig);
 
export const auth = getAuth(app);
export const db   = getFirestore(app);