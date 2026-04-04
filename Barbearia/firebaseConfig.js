import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIkN4dtsMy_XCoGucHWrzOGeDtDbmD9SY",
  authDomain: "barbearia-tcc123.firebaseapp.com",
  projectId: "barbearia-tcc123",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);