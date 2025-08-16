import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "scansense-ral9o",
  "appId": "1:201224191342:web:18f166fec6284b45b2557f",
  "storageBucket": "scansense-ral9o.firebasestorage.app",
  "apiKey": "AIzaSyASNKEZPB_F20QpJwcAehE9fJSTrYXQjEs",
  "authDomain": "scansense-ral9o.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "201224191342"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };