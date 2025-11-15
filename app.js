let undoStack = [];
let redoStack = [];
// Display all tasks
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
}

// Add task function
function addfunction() {
  let add_tasks = document.querySelector('.task-input').value;
  let urgency = document.querySelector('.urgecny-number').value;
  let difficulty = document.querySelector('.difficuly-number').value;
  let tags = document.querySelector('.tags').value;
  
  if (add_tasks.trim() === "") {
    alert("Please enter a task title!");
    return;
  }
  
  taskObj.addTask(add_tasks, urgency, difficulty, tags);
  
  displaylists();

  document.querySelector('.task-input').value = "";
  document.querySelector('.urgecny-number').value = "";
  document.querySelector('.difficuly-number').value = "";
  document.querySelector('.tags').value = "";
}

function add() {
  document.querySelector(".add-btn").addEventListener('click', addfunction);
}

// --- Minimal delete ---
function deleteTask(id) {
  taskObj.deleteTask(id);
  displaylists();
}

// --- Minimal edit ---
function editTask(id) {
  id = Number(id); // FIX #1

  let task = taskObj.taskList.find(t => t.id === id);
  if (!task) return;

  let title = prompt("Title:", task.title);
  let urgency = prompt("Urgency:", task.urgency);
  let difficulty = prompt("Difficulty:", task.difficulty);
  let tags = prompt("Tags:", task.tags);

  taskObj.updateTask(id, {
    title: title || task.title,
    urgency: urgency || task.urgency,
    difficulty: difficulty || task.difficulty,
    tags: tags || task.tags
  });

  taskObj.save();      // FIX #2
  displaylists();      // FIX #3
}

// Initialize

taskObj.load();
displaylists();
add();
