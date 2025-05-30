import { db } from './firebase-config.js';
import { doc, getDoc, setDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const userForm = document.getElementById('userForm');

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const teamName = userForm.teamName.value.trim();
  const members = userForm.members.value.trim();
  const projectName = userForm.projectName.value.trim();
  const description = userForm.description.value.trim();
  const repoLink = userForm.repoLink.value.trim();
  const demoLink = userForm.demoLink.value.trim();

  if (!teamName || !members || !projectName || !description || !repoLink) {
    alert('Please fill all required fields');
    return;
  }

  try {
    const docRef = doc(collection(db, 'projects'), teamName);
    const existing = await getDoc(docRef);

    if (existing.exists()) {
      alert('Team name already exists. Please choose a different name.');
      return;
    }

    await setDoc(docRef, {
      teamName,
      members: members.split(',').map(m => m.trim()),
      projectName,
      description,
      repoLink,
      demoLink: demoLink || '',
      score: null,
      comments: '',
      createdAt: serverTimestamp(),
    });

    window.location.href = 'user-success.html';
  } catch (error) {
    console.error('Error adding document:', error);
    alert('Error submitting project. See console for details.');
  }
});
