// admin-login.js

import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const adminLoginForm = document.getElementById('adminLoginForm');

adminLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = adminLoginForm.email.value.trim();
  const passkey = adminLoginForm.passkey.value.trim();

  try {
    // 1. Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, passkey);
    const user = userCredential.user;

    // 2. Check if the user exists in Firestore `admins` collection
    const adminDocRef = doc(db, "admins", email); // using email as document ID
    const adminDoc = await getDoc(adminDocRef);

    if (adminDoc.exists()) {
      //  Admin verified
      localStorage.setItem('adminLoggedIn', 'true');
      window.location.href = 'admin-dashboard.html';
    } else {
      alert('Access denied: Not an admin.');
    }
  } catch (error) {
    console.error('Login failed:', error.code, error.message);
    alert('Invalid email or password');
  }
});

document.querySelector('.back-button').addEventListener('click', () => {
  window.location.href = 'index.html';
});