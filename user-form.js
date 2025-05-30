// Initialize Firestore and add user submission
const db = firebase.firestore();



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);



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
    // Check if team name exists
    const docRef = db.collection('projects').doc(teamName);
    const doc = await docRef.get();
    if (doc.exists) {
      alert('Team name already exists. Please choose a different name.');
      return;
    }

    await docRef.set({
      teamName,
      members: members.split(',').map(m => m.trim()),
      projectName,
      description,
      repoLink,
      demoLink: demoLink || '',
      score: null,
      comments: '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // Redirect to the success page after successful submission
    console.log("Submission successful, redirecting now...");
    window.location.href = 'user-success.html';
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Error submitting project. See console for details.');
  }
});
