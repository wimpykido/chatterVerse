import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDO41gdMyLD_LbK80550cXslim97GseQPs",
  authDomain: "social-app-93564.firebaseapp.com",
  projectId: "social-app-93564",
  storageBucket: "social-app-93564.appspot.com",
  messagingSenderId: "407028949107",
  appId: "1:407028949107:web:6c9f755213c7e2daea0a06",
  measurementId: "G-MCR1G7SXGK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
setPersistence(auth, browserSessionPersistence);
export { auth, db, storage };
