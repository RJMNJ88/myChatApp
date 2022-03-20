import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzJtwKQZIqFMW5yoYzISJ1k81--0p3qcA",
  authDomain: "mychatapp-21d2c.firebaseapp.com",
  projectId: "mychatapp-21d2c",
  storageBucket: "mychatapp-21d2c.appspot.com",
  messagingSenderId: "726937327301",
  appId: "1:726937327301:web:99877607e581355e4002ac"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app=firebase.app();
}

// Exports
const db = app.firestore();
const auth = firebase.auth();
export { db, auth };