class ParserFactory {
  constructor() {
    this.text = '';
  }

  filter(index, size, task) {
    if (index >= (size - 8) || index <= 20) {
      return true;
    } else if (this.isEmpty(task)) {
      return true;
    } else if (this.isEmpty(task.replace(/-/g, ''))) {
      return true;
    } else if (task.trim() === 'Other tasks') {
      return true;
    } else if (task.trim() === 'BUILD SUCCESSFUL') {
      return true;
    } else {
      return false;
    }
  }

  write(out) {
    this.text += out;
  }

  parser() {
    this.tasks = this.text.split('\n').map(task => task);

    this.handleTask = this.tasks.filter((task, i) => !this.filter(i, this.tasks.length, task));

    this.tasks = [];
    this.tasks.push(...this.handleTask);

    this.handleTask = [];

    for (let [t, i] of this.tasks.entries()) {
      let arr = ('' + t).split(' - ');
      this.handleTask.push(arr[0]);
    }

    this.tasks = [];
    this.tasks.push(...this.handleTask);
    return this.tasks;
  }

  close() {
    this.text = '';
  }

  isEmpty(s) {
    return !s?.trim();
  }
}

module.exports = ParserFactory;
