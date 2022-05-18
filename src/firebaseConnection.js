import firebase from 'firebase/app';
// import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAeC5Ywc7hnc0nUn3YZpUemXfFFSpeitgs",
  authDomain: "cursoreactjs-2deae.firebaseapp.com",
  projectId: "cursoreactjs-2deae",
  storageBucket: "cursoreactjs-2deae.appspot.com",
  messagingSenderId: "979631654438",
  appId: "1:979631654438:web:0ce32d676074d4432b08e7",
  measurementId: "G-6KYLMT9ZS6"
};

// Initialize Firebase
if (!firebase.apps.length){
   firebase.initializeApp(firebaseConfig);
}

export default firebase;
