class Task {
  constructor(id, title, urgency, difficulty, tags, estTime, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.urgency = urgency;
    this.difficulty = difficulty;
    this.tags = tags;
    this.estTime = estTime;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

let undoStack = [];
let redoStack = [];

let taskObj = {
  taskList: [],
  taskId: 0,

  addTask(title, urgency, difficulty, tags, estTime) {
    this.taskId++;
    let newTask = new Task(
      this.taskId,
      title,
      urgency,
      difficulty,
      tags,
      estTime || 0,
      new Date().toISOString(),
      new Date().toISOString()
    );

    this.taskList.push(newTask);

    undoStack.push({
      type: "ADD",
      task: JSON.parse(JSON.stringify(newTask)),
    });
    redoStack = [];

    this.save();
  },

  updateTask(id, newValues) {
    let task = this.taskList.find(t => t.id === id);
    if (!task) return;

    undoStack.push({
      type: "UPDATE",
      before: JSON.parse(JSON.stringify(task)),
    });
    redoStack = [];

    Object.assign(task, newValues);
    task.updatedAt = new Date().toISOString();

    this.save();
  },

  deleteTask(id) {
    let task = this.taskList.find(t => t.id === id);
    if (!task) return;

    undoStack.push({
      type: "DELETE",
      task: JSON.parse(JSON.stringify(task)),
    });
    redoStack = [];

    this.taskList = this.taskList.filter(t => t.id !== id);

    this.save();
  },

  undo() {
    if (undoStack.length === 0) return;

    let action = undoStack.pop();
    redoStack.push(JSON.parse(JSON.stringify(action)));

    if (action.type === "ADD") {
      this.taskList = this.taskList.filter(t => t.id !== action.task.id);
    }

    else if (action.type === "UPDATE") {
      let t = this.taskList.find(x => x.id === action.before.id);
      Object.assign(t, action.before);
    }

    else if (action.type === "DELETE") {
      this.taskList.push(action.task);
    }

    this.save();
  },

  redo() {
    if (redoStack.length === 0) return;

    let action = redoStack.pop();
    undoStack.push(JSON.parse(JSON.stringify(action)));

    if (action.type === "ADD") {
      this.taskList.push(action.task);
    }

    else if (action.type === "UPDATE") {
      let t = this.taskList.find(x => x.id === action.before.id);
      Object.assign(t, action.after);
    }

    else if (action.type === "DELETE") {
      this.taskList = this.taskList.filter(t => t.id !== action.task.id);
    }

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

