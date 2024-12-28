import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGc9NZxcglX-f9sVX0ZnY4j3AWsw6HWak",
  authDomain: "otpverify-c06af.firebaseapp.com",
  projectId: "otpverify-c06af",
  storageBucket: "otpverify-c06af.firebasestorage.app",
  messagingSenderId: "1041633145126",
  appId: "1:1041633145126:web:9e6b15a4c052cdb4cb11e7",
  measurementId: "G-1Q7DM6SLZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
