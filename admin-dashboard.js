// admin-dashboard.js

import { db } from './firebase-config.js';
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const projectsContainer = document.getElementById('projectsContainer');

// Check if admin is logged in
function checkAdminAuth() {
  if (localStorage.getItem('adminLoggedIn') !== 'true') {
    alert('Please login as admin');
    window.location.href = 'admin-login.html';
  }
}

checkAdminAuth();

// Function to create a team project card
function createProjectCard(project) {
  const div = document.createElement('div');
  div.classList.add('team-card');
  div.innerHTML = `
    <h3>${project.teamName}</h3>
    <p><strong>Project:</strong> ${project.projectName}</p>
  `;

  div.onclick = () => {
    // Store selected team name and redirect to score page
    localStorage.setItem('selectedTeam', project.teamName);
    window.location.href = 'score-project.html';
  };

  return div;
}

// Realtime listener to update dashboard on new submissions
function loadProjectsLive() {
  projectsContainer.innerHTML = '<p>Loading...</p>';

  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

  onSnapshot(q, (snapshot) => {
    projectsContainer.innerHTML = ''; // Clear existing cards

    if (snapshot.empty) {
      projectsContainer.innerHTML = '<p>No projects submitted yet.</p>';
      return;
    }

    snapshot.forEach(doc => {
      const card = createProjectCard(doc.data());
      projectsContainer.appendChild(card);
    });
  }, (error) => {
    console.error('Error loading projects:', error);
    projectsContainer.innerHTML = '<p>Error loading projects.</p>';
  });
}

loadProjectsLive();
const seeResultsBtn = document.getElementById('seeResultsBtn');
seeResultsBtn.addEventListener('click', () => {
  window.location.href = 'result.html';
});
// Add this at the bottom of admin-dashboard.js
document.querySelector('.back-button').addEventListener('click', () => {
  window.location.href = 'admin-login.html';
});