class Task {
  constructor(id, title, urgency, difficulty, tags, estTime, createdAt, updatedAt, versions=[], done=false) {
    this.id = id;
    this.title = title;
    this.urgency = urgency;
    this.difficulty = difficulty;
    this.tags = tags;
    this.estTime = estTime;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.versions = versions;
    this.done = done;
  }
}

function undo() {
  if (undoStack.length === 0) {
    alert("Nothing to undo");
    return;
  }

  let operation = undoStack.pop();

  if (operation.type === "ADD") {
    // reverse of add → remove the task
    let id = operation.payload.id;
    let task = taskObj.taskList.find(t => t.id === id);
    if (task) {
      // save this delete to redo stack
      redoStack.push({
        type: "ADD",
        payload: { id }
      });

      taskObj.taskList = taskObj.taskList.filter(t => t.id !== id);
      taskObj.save();
    }
  }

  else if (operation.type === "DELETE") {
    // reverse of delete → restore the task
    let removed = operation.payload;

    redoStack.push({
      type: "DELETE",
      payload: removed
    });

    taskObj.taskList.push(removed);
    taskObj.save();
  }

  else if (operation.type === "UPDATE") {
    // reverse of update → restore BEFORE version
    let { before, after } = operation.payload;

    redoStack.push({
      type: "UPDATE",
      payload: { before, after }
    });

    let task = taskObj.taskList.find(t => t.id === before.id);
    if (task) {
      Object.assign(task, before);
      taskObj.save();
    }
  }

  displaylists();
}
// Task manager object
let taskObj = {
  taskList: [],
  taskId: 0,
  addTask: function(title, urgency, difficulty, tags, estTime) {
    this.taskId++;
    let newTask = new Task(
      this.taskId,
      title,
      urgency,
      difficulty,
      tags,
      estTime || 0,
      new Date().toISOString(),
      new Date().toISOString(),
      [],
      
    );
    this.taskList.push(newTask);
    undoStack.push({
      type: "ADD",
      payload: { id: newTask.id }
    });
    redoStack = [];
    this.save();
  },
  updateTask: function(id, newValues) {
  let task = this.taskList.find(t => t.id === id);
  if (!task) return;

  // Save OLD version
  let oldCopy = JSON.parse(JSON.stringify(task));

  // Apply updates
  Object.assign(task, newValues);
task.updatedAt = new Date().toISOString();

  // Save NEW version
  let newCopy = JSON.parse(JSON.stringify(task));

  // Save undo operation
  undoStack.push({
    type: "UPDATE",
    payload: { before: oldCopy, after: newCopy }
  });
  redoStack = [];

  this.save();
},
deleteTask: function(id) {
  // Find task before deleting
  let removedTask = this.taskList.find(t => t.id === id);
  if (!removedTask) return;

  // Remove from list
  this.taskList = this.taskList.filter(t => t.id !== id);

  // Save undo operation
  undoStack.push({
    type: "DELETE",
    payload: removedTask
  });
  redoStack = [];

  this.save();
},

  save() {
    localStorage.setItem("taskList", JSON.stringify(this.taskList));
  },

  load() {
    let data = localStorage.getItem("taskList");
    if (data) {
      this.taskList = JSON.parse(data);
      this.taskId = this.taskList.length ? this.taskList[this.taskList.length - 1].id : 0;
    }
  }
};

