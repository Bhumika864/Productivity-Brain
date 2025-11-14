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
    this.save();
  },
  updateTask: function(id,newValues){
    let task=this.taskList.find(t=>t.id===id);
    if(!task) return;
    let oldVersion = JSON.parse(JSON.stringify(task)); // deep copy
    task.versions.push(oldVersion);
task.updatedAt = new Date().toISOString();         // matches your original structure

    // Apply updates
    Object.assign(task, newValues);
    task.updatedAt = Date.now();

    this.save();
  },deleteTask(id) {
    this.taskList = this.taskList.filter(t => t.id !== id);
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

