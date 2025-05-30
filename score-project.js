// score-project.js

const db = firebase.firestore();
const scoreForm = document.getElementById('scoreForm');
const msg = document.getElementById('msg');
const teamHeader = document.getElementById('teamHeader');
const projectHeader = document.getElementById('projectHeader');

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

// Load team/project info and pre-fill if already scored
async function loadProjectDetails() {
  try {
    const docRef = db.collection('projects').doc(selectedTeam);
    const doc = await docRef.get();

    if (!doc.exists) {
      alert('Project not found');
      window.location.href = 'admin-dashboard.html';
      return;
    }

    const data = doc.data();

    // Show team and project name
    teamHeader.textContent = `Team: ${data.teamName}`;
    projectHeader.textContent = `Project: ${data.projectName}`;

    // Pre-fill scores if they exist
    if (data.innovation) scoreForm.innovation.value = data.innovation;
    if (data.technical) scoreForm.technical.value = data.technical;
    if (data.design) scoreForm.design.value = data.design;
    if (data.functionality) scoreForm.functionality.value = data.functionality;
    if (data.presentation) scoreForm.presentation.value = data.presentation;
    if (data.comments) scoreForm.comments.value = data.comments;

    if (data.score) {
      msg.textContent = 'This project has already been scored. You can update the score.';
    }

  } catch (error) {
    console.error('Error loading project:', error);
    alert('Error loading project details.');
  }
}
loadProjectDetails();

// Handle form submission
scoreForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const innovation = parseInt(scoreForm.innovation.value);
  const technical = parseInt(scoreForm.technical.value);
  const design = parseInt(scoreForm.design.value);
  const functionality = parseInt(scoreForm.functionality.value);
  const presentation = parseInt(scoreForm.presentation.value);
  const comments = scoreForm.comments.value.trim();

  if (
    innovation < 1 || innovation > 10 ||
    technical < 1 || technical > 10 ||
    design < 1 || design > 10 ||
    functionality < 1 || functionality > 10 ||
    presentation < 1 || presentation > 10
  ) {
    alert('All scores must be between 1 and 10');
    return;
  }

  const totalScore = innovation + technical + design + functionality + presentation;

  try {
    await db.collection('projects').doc(selectedTeam).update({
      innovation,
      technical,
      design,
      functionality,
      presentation,
      score: totalScore,
      comments,
      scoredAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    msg.textContent = '✅ Score published successfully!';
    setTimeout(() => {
      window.location.href = 'admin-dashboard.html';
    }, 2000);
  } catch (error) {
    console.error('Error submitting score:', error);
    alert('❌ Error publishing score. Please try again.');
  }
});
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', async () => {
  const confirmReset = confirm("Are you sure you want to clear all scores and comments?");
  if (!confirmReset) return;

  try {
    await db.collection('projects').doc(selectedTeam).update({
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
    
    // Clear form fields
    scoreForm.innovation.value = '';
    scoreForm.technical.value = '';
    scoreForm.design.value = '';
    scoreForm.functionality.value = '';
    scoreForm.presentation.value = '';
    scoreForm.comments.value = '';

  } catch (error) {
    console.error("Reset failed:", error);
    alert("❌ Failed to reset scores. Try again.");
  }
});
document.getElementById('backBtn').addEventListener('click', () => {
  window.history.back(); // Navigates back to the previous page
});
