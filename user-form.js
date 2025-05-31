import { db } from './firebase-config.js';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const userForm = document.getElementById('userForm');
const teamNameInput = userForm.teamName;
const teamNameWarning = document.getElementById('teamNameWarning');

let teamExists = false;

teamNameInput.addEventListener('input', async () => {
  const teamName = teamNameInput.value.trim().toLowerCase();
  if (!teamName) {
    teamNameWarning.style.display = 'none';
    teamExists = false;
    return;
  }

  const docRef = doc(collection(db, 'projects'), teamName);
  const existing = await getDoc(docRef);

  if (existing.exists()) {
    teamExists = true;
    teamNameWarning.style.display = 'block';
    teamNameWarning.textContent = '⚠️ Team name already exists if not yours choose a different name. Submitting again will update the existing entry!';
  } else {
    teamExists = false;
    teamNameWarning.style.display = 'none';
  }
});

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const teamNameOriginal = userForm.teamName.value.trim();
  const teamNameId = teamNameOriginal.toLowerCase();

  const members = userForm.members.value.trim();
  const projectName = userForm.projectName.value.trim();
  const description = userForm.description.value.trim();
  const repoLink = userForm.repoLink.value.trim();
  const demoLink = userForm.demoLink.value.trim();

  if (!teamNameOriginal || !members || !projectName || !description || !repoLink) {
    alert('Please fill all required fields');
    return;
  }

  try {
    const docRef = doc(collection(db, 'projects'), teamNameId);
    const existing = await getDoc(docRef);

    if (existing.exists()) {
      const confirmUpdate = confirm('⚠️ Team name already exists. Do you want to overwrite the existing entry?');
      if (!confirmUpdate) return;
    }

    await setDoc(docRef, {
      teamName: teamNameOriginal,
      members: members.split(',').map(m => m.trim()),
      projectName,
      description,
      repoLink,
      demoLink: demoLink || '',
      score: null,
      comments: '',
      createdAt: serverTimestamp()
    });

    window.location.href = 'user-success.html';

  } catch (error) {
    console.error('Error adding document:', error);
    alert('Error submitting project. See console for details.');
  }
});