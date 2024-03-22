import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";




// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVRyqUNprbk1vV89W17QtHDlu5bH4hLFs",
  authDomain: "admin-b89d5.firebaseapp.com",
  projectId: "admin-b89d5",
  storageBucket: "admin-b89d5.appspot.com",
  messagingSenderId: "249155682735",
  appId: "1:249155682735:web:1ce611a3d2e1885fb2af5a"
};
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)

  export { db };
 