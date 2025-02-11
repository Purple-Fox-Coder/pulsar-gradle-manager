const { View, $, $$ } = require('space-pen');

class LeftTaskView extends View {
  static content() {
    // This static method sets up the content structure using the space-pen DSL.
    return this.div({ outlet: 'body', 'class': 'task-container' }, () => {
      return this.ul({ outlet: 'taskList' });
    });
  }

  refresh(outputView, tasks) {
    // Sort the tasks and create a list item for each task,
    // attaching a click event handler that calls outputView.runTask with the task.
    tasks.sort().forEach(task => {
      let listItem = $("<li><div class='icon icon-zap'>" + task + "</div></li>");

      // Immediately capture the current task value in the event handler closure.
      listItem.first().on('click', () => {
        outputView.runTask(task);
      });

      this.taskList.append(listItem);
    });
  }

  clear() {
    // Clears the task list content.
    this.taskList.empty();
  }
}

module.exports = LeftTaskView;
