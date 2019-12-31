import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firebase-firestore'

var firebaseConfig = {
  apiKey: "AIzaSyBc-WANVciwFBtXxzIcdEZOWZUh2m4T77M",
  authDomain: "chat-app-0022.firebaseapp.com",
  databaseURL: "https://chat-app-0022.firebaseio.com",
  projectId: "chat-app-0022",
  storageBucket: "chat-app-0022.appspot.com",
  messagingSenderId: "831303328226",
  appId: "1:831303328226:web:03b98c29fa8c94030759bb",
  measurementId: "G-YRW9G14TMQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
 export default firebase