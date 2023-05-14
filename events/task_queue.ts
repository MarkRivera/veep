export type Message = {
  name: string;
  data: Array<any>;
}

class TaskQueue {
  private tasks: Message[] = [];

  public addTask(task: Message) {
    this.tasks.push(task);
  }

  public popTask() {
    return this.tasks.shift();
  }

  public getTasks() {
    return this.tasks;
  }

  public getTaskCount() {
    return this.tasks.length;
  }
}

export {
  TaskQueue
}