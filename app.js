// -------------------------------
// AI SCORING SYSTEM
// -------------------------------
function getTaskScore(task, energyLevel) {

  let created = new Date(task.createdAt);
  let daysOld = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
  let recencyBoost = Math.min(daysOld, 10);

  let est = parseInt(task.estTime) || 0;
  let smallTaskBoost = est < 30 ? 5 : est < 60 ? 2 : 0;

  let difficulty = parseInt(task.difficulty) || 0;
  let energyMatch = Math.max(0, energyLevel - difficulty) * 2;

  let tagBoost = 0;
  if (task.tags.includes("important")) tagBoost += 5;
  if (task.tags.includes("college")) tagBoost += 3;
  if (task.tags.includes("project")) tagBoost += 4;

  let urgency = parseInt(task.urgency) || 0;
  let difficultyPenalty = difficulty * 1.5;

  return (
    (urgency * 3) +
    recencyBoost +
    smallTaskBoost +
    energyMatch +
    tagBoost -
    difficultyPenalty
  );
}

// Pick best task
function getRankedTasks(energyLevel = 5) {
  if (!taskObj.taskList || taskObj.taskList.length === 0) return [];

  let ranked = taskObj.taskList.map(task => {
    return {
      task,
      score: getTaskScore(task, energyLevel)
    };
  });

  ranked.sort((a, b) => b.score - a.score);

  return ranked;
}


function showRankedTasks() {
  let energyInput = document.querySelector(".energy-input");
  let energy = energyInput ? parseInt(energyInput.value) : 5;

  let ranked = getRankedTasks(energy);

  let container = document.querySelector(".recommended-task .all-tasks");

  if (!ranked.length) {
    container.innerHTML = "<p>No tasks available</p>";
    return;
  }

  container.innerHTML = ranked.map(item => `
    <div class="recommended-card" style="
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin: 10px 0;
    ">
      <h2>${item.task.title}</h2>
      <p><b>Score:</b> ${item.score.toFixed(2)}</p>
      <p>Urgency: ${item.task.urgency}</p>
      <p>Difficulty: ${item.task.difficulty}</p>
      <p>Tags: ${item.task.tags}</p>
    </div>
  `).join("");
}

// -------------------------------
// UI RENDERING
// -------------------------------
function displaylists() {
  let ul = document.querySelector(".task-lst");
  ul.innerHTML = "";
  
  taskObj.taskList.forEach(task => {
    let li = document.createElement("li");

    li.innerHTML = `
      <h3>${task.title}</h3>
      <p>Urgency: ${task.urgency}</p>
      <span>Difficulty: ${task.difficulty}</span>
      <span>Tags: ${task.tags}</span>

      <button onclick="editTask(${task.id})">Edit</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;

    ul.appendChild(li);
  });

  showRankedTasks();
 // update AI suggestion
}
function applyFilters() {
  let search = document.querySelector(".filter-search").value.toLowerCase();
  let urgency = document.querySelector(".filter-urgency").value;
  let difficulty = document.querySelector(".filter-difficulty").value;
  let tags = document.querySelector(".filter-tags").value.toLowerCase();

  let filtered = taskObj.taskList.filter(task => {

    let matchesSearch = task.title.toLowerCase().includes(search);

    let matchesUrgency = urgency === "" || task.urgency == urgency;

    let matchesDifficulty = difficulty === "" || task.difficulty == difficulty;

    let matchesTags = tags === "" || task.tags.toLowerCase().includes(tags);

    return matchesSearch && matchesUrgency && matchesDifficulty && matchesTags;
  });

  renderFilteredTasks(filtered);
  showRankedTasks(); // Keep AI updated
}

function renderFilteredTasks(list) {
  let ul = document.querySelector(".task-lst");
  ul.innerHTML = "";

  list.forEach(task => {
    let li = document.createElement("li");

    li.innerHTML = `
      <h3>${task.title}</h3>
      <p>Urgency: ${task.urgency}</p>
      <span>Difficulty: ${task.difficulty}</span>
      <span>Tags: ${task.tags}</span>

      <button onclick="editTask(${task.id})">Edit</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;

    ul.appendChild(li);
  });
}
function clearFilters() {
  document.querySelector(".filter-search").value = "";
  document.querySelector(".filter-urgency").value = "";
  document.querySelector(".filter-difficulty").value = "";
  document.querySelector(".filter-tags").value = "";

  displaylists(); // restore full list
}


// -------------------------------
// ADD TASK
// -------------------------------
function addfunction() {
  let title = document.querySelector(".task-input").value;
  let urgency = document.querySelector(".urgecny-number").value;
  let difficulty = document.querySelector(".difficuly-number").value;
  let tags = document.querySelector(".tags").value;

  if (title.trim() === "") {
    alert("Enter title");
    return;
  }

  taskObj.addTask(title, urgency, difficulty, tags);
  displaylists();

  // Reset UI
  document.querySelector(".task-input").value = "";
  document.querySelector(".urgecny-number").value = "";
  document.querySelector(".difficuly-number").value = "";
  document.querySelector(".tags").value = "";
}

document.querySelector(".add-btn").addEventListener("click", addfunction);

// -------------------------------
// DELETE TASK
// -------------------------------
function deleteTask(id) {
  id = Number(id);
  taskObj.deleteTask(id);
  displaylists();
}



// -------------------------------
// EDIT TASK
// -------------------------------
function editTask(id) {
  id = Number(id);
  let task = taskObj.taskList.find(t => t.id === id);
  if (!task) return;

  let title = prompt("Title:", task.title);
  if (title === null) return;

  let urgency = prompt("Urgency:", task.urgency);
  if (urgency === null) return;

  let difficulty = prompt("Difficulty:", task.difficulty);
  if (difficulty === null) return;

  let tags = prompt("Tags:", task.tags);
  if (tags === null) return;

  taskObj.updateTask(id, {
    title: title.trim() === "" ? task.title : title,
    urgency: urgency.trim() === "" ? task.urgency : urgency,
    difficulty: difficulty.trim() === "" ? task.difficulty : difficulty,
    tags: tags.trim() === "" ? task.tags : tags
  });

  displaylists();
}

// -------------------------------
// GLOBAL UNDO / REDO
// -------------------------------
function undo() {
  taskObj.undo();
  displaylists();
}

function redo() {
  taskObj.redo();
  displaylists();
}

// -------------------------------
// INIT
// -------------------------------
taskObj.load();
displaylists();
showRankedTasks();


