const { View, $ } = require('space-pen');
const { Emitter, CompositeDisposable } = require('atom');
const GradleRunner = require('../gradle-runner');
const LeftPane = require('./left-pane');
const Converter = require('ansi-to-html');
const { Toolbar } = require('atom-bottom-dock');
const Parser = require('../ParserUtil');

class OutputView extends View {
  content() {
    this.div({ class: 'output-view', style: 'display:flex;' }, () => {
      this.div({ class: 'content-container' }, () => {
        this.div({ outlet: 'outputContainer', class: 'output-container native-key-bindings', tabindex: -1 });
      });
    });
  }

  initialize() {
    this.emitter = new Emitter();
    this.converter = new Converter({ fg: $('<span>').css('color') });
    this.subscriptions = new CompositeDisposable();
    this.leftPaneItem = new LeftPane();
    this.leftPane = atom.workspace.addRightPanel({ item: this.leftPaneItem, visible: false });
  }

  show() {
    super.show();
    this.leftPane.show();
  }

  setupTaskList(tasks) {
    this.leftPaneItem.refresh(this, tasks);
  }

  refreshTasks() {
    this.tasks = [];
    const output = "fetching gradle tasks";
    this.writeOutput(output, 'text-info');
    const parser = new Parser();

    const onTaskOutput = (output, type) => {
      this.writeOutput(output, type);
      if (type) {
        return;
      } else {
        parser.write(output);
      }
    };

    const onTaskExit = (code) => {
      if (code === 0) {
        this.tasks = parser.parser();
        parser.close();
        this.setupTaskList(this.tasks);
        this.writeOutput(`${this.tasks.length} tasks found`, "text-info");
      } else {
        this.onExit(code);
      }
    };

    this.Runner.getGradleTasks(onTaskOutput, this.onError, onTaskExit);
  }

  setupGradleRunner() {
    this.Runner = new GradleRunner();
  }

  runTask(task, args) {
    this.Runner?.runGradle(task, this.onOutput, this.onError, this.onExit, args);
  }

  writeOutput(line, klass) {
    if (!line?.length) return;

    const el = $('<pre>');
    el.append(line);

    if (klass) el.addClass(klass);
    this.outputContainer.append(el);
    this.outputContainer.scrollToBottom();
  }

  onOutput(output) {
    output.split('\n').forEach(line => {
      this.writeOutput(this.converter.toHtml(line));
    });
  }

  onError(output) {
    output.split('\n').forEach(line => {
      this.writeOutput(this.converter.toHtml(line), 'text-error');
    });
  }

  onExit(code) {
    this.writeOutput(`Exited with code ${code}`, code ? 'text-error' : 'text-success');
  }

  stop() {
    this.Runner?.destroy();
    this.writeOutput('Task Stopped', 'text-info');
  }

  clear() {
    this.outputContainer.empty();
  }

  refreshUIAndTask() {
    this.outputContainer.empty();
    this.leftPaneItem.clear();
    this.setupGradleRunner();
    this.refreshTasks();
  }

  destroy() {
    this.leftPane.destroy();
    this.Runner?.destroy();
    this.Runner = null;
    this.subscriptions?.dispose();
  }
}

module.exports = OutputView;
