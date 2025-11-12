
// Load tasks from localStorage on page load
function loadTaskList() {
  if (window.localStorage) {
    if (localStorage.getItem("taskList")) {
      let data = localStorage.getItem("taskList");
      taskObj.taskList = JSON.parse(data);
      // Update taskId to highest existing id
      if (taskObj.taskList.length > 0) {
        taskObj.taskId = Math.max(...taskObj.taskList.map(t => t.id));
      }
      displaylists();
    }
  } else {
    alert("Your browser does not support local storage!");
  }
}

// Save tasks to localStorage
function saveTaskList() {
  if (window.localStorage) {
    let data = JSON.stringify(taskObj.taskList);
    localStorage.setItem("taskList", data);
  } else {
    alert("Your browser does not support local storage!");
  }
}

// Display all tasks
function displaylists() {
  let ul = document.querySelector(".task-lst");
  ul.innerHTML = ""; // Clear existing list
  
  taskObj.taskList.forEach(task => {
    let li = document.createElement("li");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");
    let difficulty = document.createElement("span");
    let tag = document.createElement("span");
    
    h3.innerText = task.title;
    p.innerText = "Urgency: " + task.urgency;
    difficulty.innerText = "Difficulty: " + task.difficulty;
    tag.innerText = "Tags: " + task.tags;
    
    li.appendChild(h3);
    li.appendChild(p);
    li.appendChild(difficulty);
    li.appendChild(tag);
    
    ul.appendChild(li);
  });
}

// Add task function
function addfunction() {
  let add_tasks = document.querySelector('.task-input').value;
  let urgency = document.querySelector('.urgecny-number').value;
  let difficulty = document.querySelector('.difficuly-number').value;
  let tags = document.querySelector('.tags').value;
  
  // Validate input
  if (add_tasks.trim() === "") {
    alert("Please enter a task title!");
    return;
  }
  
  taskObj.addTask(add_tasks, urgency, difficulty, tags);
  saveTaskList(); // Save to localStorage
  displaylists(); // Update display
  
  // Clear input fields
  document.querySelector('.task-input').value = "";
  document.querySelector('.urgecny-number').value = "";
  document.querySelector('.difficuly-number').value = "";
  document.querySelector('.tags').value = "";
}

// Set up event listener
function add() {
  document.querySelector(".add-btn").addEventListener('click', addfunction);
}

// Initialize
loadTaskList();
add();