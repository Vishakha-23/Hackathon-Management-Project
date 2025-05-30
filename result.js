import { db } from "./firebase-config.js";
import {
  getDocs,
  collection,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const resultsContainer = document.getElementById("resultsContainer");
const pendingContainer = document.getElementById("pendingContainer");

async function loadResults() {
  const q = query(collection(db, "projects"), orderBy("createdAt", "asc"));
  const querySnapshot = await getDocs(q);

  const scoredProjects = [];
  const pendingProjects = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.score != null) {
      scoredProjects.push(data);
    } else {
      pendingProjects.push(data);
    }
  });

  // Sort by score descending
  scoredProjects.sort((a, b) => b.score - a.score);

  // Render scored projects
  scoredProjects.forEach((project, index) => {
    const card = document.createElement("div");
    card.className = "result-card";

    // 🏅 Medal for top 3
    let medal = "";
    if (index === 0) medal = "🥇";
    else if (index === 1) medal = "🥈";
    else if (index === 2) medal = "🥉";

    card.innerHTML = `
      <div class="rank-badge">${medal || "🏆"} Rank #${index + 1}</div>
      <h3>${project.teamName}</h3>
      <p><strong>Score:</strong> ${project.score}</p>
      <p><strong>Project:</strong> ${project.projectName}</p>
      <p>${project.description}</p>
    `;

    resultsContainer.appendChild(card);
  });

  // Render pending projects
  pendingProjects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "result-card pending";

    card.innerHTML = `
      <div class="rank-badge">🕓 Pending</div>
      <h3>${project.teamName}</h3>
      <p><strong>Project:</strong> ${project.projectName}</p>
      <p>${project.description}</p>
    `;

    pendingContainer.appendChild(card);
  });
}

loadResults();
