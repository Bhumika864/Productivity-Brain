class Task {
  constructor(id, title, urgency, difficulty, tags, estTime, createdAt, updatedAt, versions, done) {
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
      false
    );
    this.taskList.push(newTask);
  }
}