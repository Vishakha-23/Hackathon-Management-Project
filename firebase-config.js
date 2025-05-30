// firebase-config.js

// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc3LpO5jRgYDQwujyL40l7UuOLWPmPyXs",
  authDomain: "hackathon-management-37d9a.firebaseapp.com",
  projectId: "hackathon-management-37d9a",
  storageBucket: "hackathon-management-37d9a.appspot.com",
  messagingSenderId: "7800574108",
  appId: "1:7800574108:web:47013ec14a78a4f5729d59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in other files
export { db, auth };
