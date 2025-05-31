import { db } from './firebase-config.js';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

const scoreForm = document.getElementById('scoreForm');
const msg = document.getElementById('msg');
const teamHeader = document.getElementById('teamHeader');
const projectHeader = document.getElementById('projectHeader');
const resetBtn = document.getElementById('resetBtn');
const backBtn = document.querySelector('.back-button');

function checkAdminAuth() {
  if (localStorage.getItem('adminLoggedIn') !== 'true') {
    alert('Please login as admin');
    window.location.href = 'admin-login.html';
  }
}
checkAdminAuth();

const selectedTeam = localStorage.getItem('selectedTeam');
if (!selectedTeam) {
  alert('No team selected');
  window.location.href = 'admin-dashboard.html';
}

async function loadProjectDetails() {
  try {
    // Convert team name to lowercase to match how it's stored
    const teamId = selectedTeam.toLowerCase();
    const docRef = doc(db, 'projects', teamId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert('Project not found for team: ' + selectedTeam);
      window.location.href = 'admin-dashboard.html';
      return;
    }

    const data = docSnap.data();

    // Debugging: log the retrieved data
    console.log('Retrieved project data:', data);

    teamHeader.textContent = `Team: ${data.teamName || 'Not available'}`;
    projectHeader.textContent = `Project: ${data.projectName || 'Not available'}`;

    const repoLink = document.getElementById('repoLink');
    const demoLink = document.getElementById('demoLink');
    const projectDesc = document.getElementById('projectDesc');
    const teamMembers = document.getElementById('teamMembers');

    // Handle repository link
    if (data.repoLink) {
      repoLink.href = data.repoLink;
      repoLink.textContent = 'View Repository';
    } else {
      repoLink.textContent = 'Not provided';
      repoLink.removeAttribute('href');
    }

    // Handle demo link
    if (data.demoLink) {
      demoLink.href = data.demoLink;
      demoLink.textContent = 'View Demo';
    } else {
      demoLink.textContent = 'Not provided';
      demoLink.removeAttribute('href');
    }

    // Handle project description
    projectDesc.textContent = data.description || 'No description provided';

    // Handle team members
    if (data.members && Array.isArray(data.members)) {
      teamMembers.textContent = data.members.join(', ');
    } else if (data.members) {
      teamMembers.textContent = data.members;
    } else {
      teamMembers.textContent = 'No team members listed';
    }

    // Pre-fill existing scores if they exist
    if (data.innovation) scoreForm.innovation.value = data.innovation;
    if (data.technical) scoreForm.technical.value = data.technical;
    if (data.design) scoreForm.design.value = data.design;
    if (data.functionality) scoreForm.functionality.value = data.functionality;
    if (data.presentation) scoreForm.presentation.value = data.presentation;
    if (data.comments) scoreForm.comments.value = data.comments;

    if (data.score) {
      msg.textContent = 'ℹ️ This project has already been scored. You can update it.';
    }

  } catch (error) {
    console.error('❌ Error loading project:', error);
    alert('Error loading project details. See console for details.');
  }
}
loadProjectDetails();

scoreForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const innovation = parseInt(scoreForm.innovation.value);
  const technical = parseInt(scoreForm.technical.value);
  const design = parseInt(scoreForm.design.value);
  const functionality = parseInt(scoreForm.functionality.value);
  const presentation = parseInt(scoreForm.presentation.value);
  const comments = scoreForm.comments.value.trim();

  if (
    [innovation, technical, design, functionality, presentation].some(
      (val) => isNaN(val) || val < 1 || val > 10
    )
  ) {
    alert('All scores must be between 1 and 10');
    return;
  }

  const totalScore = innovation + technical + design + functionality + presentation;

  try {
    const teamId = selectedTeam.toLowerCase();
    const docRef = doc(db, 'projects', teamId);
    
    await updateDoc(docRef, {
      innovation,
      technical,
      design,
      functionality,
      presentation,
      comments,
      score: totalScore,
      scoredAt: serverTimestamp()
    });

    const popup = document.getElementById('successPopup');
    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
      window.location.href = 'admin-dashboard.html';
    }, 2500);

  } catch (error) {
    console.error('❌ Error submitting score:', error);
    alert('❌ Failed to submit score. Check console.');
  }
});

resetBtn.addEventListener('click', async () => {
  const confirmReset = confirm("Are you sure you want to clear all scores and comments?");
  if (!confirmReset) return;

  try {
    const teamId = selectedTeam.toLowerCase();
    const docRef = doc(db, 'projects', teamId);
    
    await updateDoc(docRef, {
      innovation: null,
      technical: null,
      design: null,
      functionality: null,
      presentation: null,
      score: null,
      comments: "",
      scoredAt: null
    });

    msg.textContent = '✅ Scores and comments have been cleared.';
    scoreForm.reset();
  } catch (error) {
    console.error("❌ Reset failed:", error);
    alert("❌ Failed to reset scores. Try again.");
  }
});

backBtn.addEventListener('click', () => {
  window.location.href = 'admin-dashboard.html';
});