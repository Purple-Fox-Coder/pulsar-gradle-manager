"use babel";

import FileFinderUtil from "../file-finder-util.js";
import GradleRunner from "../gradle-runner.js";
import Parser from "../parserUtil.js";

// TODO get the logic from output-view.js and move it here to use gradle-runner

// TODO add this as a config option
const SDebugLogging = false;

export default class PulsarGradleManagerView {
  static addMessage(text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog");
      logMessage.textContent = `${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addTaggedLogMessage(tag, text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog", "text-info");
      logMessage.textContent = `[${tag}] - ${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addTaggedWarnMessage(tag, text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog", "text-warning");
      logMessage.textContent = `[${tag}] - ${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addTaggedErrorMessage(tag, text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog", "text-error");
      logMessage.textContent = `[${tag}] - ${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addTaggedSuccessMessage(tag, text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog", "text-success");
      logMessage.textContent = `[${tag}] - ${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addLogMessage(text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog", "text-info");
      logMessage.textContent = `${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addWarnMessage(text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog", "text-warning");
      logMessage.textContent = `${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addErrorMessage(text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog", "text-error");
      logMessage.textContent = `${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addSuccessMessage(text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog", "text-success");
      logMessage.textContent = `${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static clearMessages() {
    const gradleLogger = document.getElementById("gradleLogger");
    while (gradleLogger.firstChild) {
      gradleLogger.removeChild(gradleLogger.firstChild);
    }
  }

  static onTaskOutput(output, type) {
    if (type == "text-info") {
      PulsarGradleManagerView.addLogMessage(output);
    } else if (type == "text-success") {
      PulsarGradleManagerView.addSuccessMessage(output);
    } else if (type == "text-warning") {
      PulsarGradleManagerView.addWarnMessage(output);
    } else if (type == "text-error") {
      PulsarGradleManagerView.addErrorMessage(output);
    }
  }

  static onExitCode(code) {
    if (code) {
      // err
      PulsarGradleManagerView.addErrorMessage(`Exited with code ${code}`);
    } else {
      // succ
      PulsarGradleManagerView.addSuccessMessage(`Exited with code ${code}`);
    }
  }

  constructor(serializedState) {
    let projectGradleFiles = FileFinderUtil.findFiles(/\.gradle$/);
    let activeGradleFile;
    let Runner = new GradleRunner();
    let parser = new Parser();

    // Create root element
    this.element = document.createElement("div");
    this.element.classList.add("pulsarGradleManagerView");

    const header = document.createElement("div");
    header.classList.add("HeaderDiv");

    // three buttons on left,
    // STOP | REFRESH | refresh with clock?

    const startButton = document.createElement("button");
    startButton.classList.add("btn", "gradleIcon", "icon", "icon-playback-play", "inline-block-tight");
    startButton.addEventListener("click", () => {
      if (SDebugLogging) {
        PulsarGradleManagerView.addTaggedLogMessage("LOG", "Gradle start!");
      }

      const taskVal = document.getElementById("gradleTask").value;
      const taskSplit = taskVal.split(' ');
      const task = taskSplit[0];

      const args = [];

      let i;
      for (i = 1; i < task.length; i++) {
        args[i - 1] = taskSplit[i];
      }

      const onTaskExit = (code) => {
        if (code === 0) {
          PulsarGradleManagerView.tasks = parser.parser();
          parser.close();
          PulsarGradleManagerView.addLogMessage(`${task.length} tasks found`);
        } else {
          PulsarGradleManagerView.onExitCode(code);
        }
      }

      // TODO  (see line 71 of output-view.js)
      Runner.runGradle(task, PulsarGradleManagerView.onTaskOutput,
        PulsarGradleManagerView.onExitCode, onTaskExit, args);
    });
    header.appendChild(startButton);

    const stopButton = document.createElement("button");
    stopButton.classList.add("btn", "gradleIcon", "icon", "icon-stop", "inline-block-tight");
    stopButton.addEventListener("click", () => {
      if(SDebugLogging) {
        PulsarGradleManagerView.addTaggedLogMessage("LOG", "Gradle stop!");
      }

      Runner.destroy();
      Runner = new GradleRunner();
      PulsarGradleManagerView.addMessage("Task Stopped");
    });
    header.appendChild(stopButton);

    const refreshButton = document.createElement("button");
    refreshButton.classList.add("btn", "gradleIcon", "icon", "icon-sync", "inline-block-tight");
    refreshButton.addEventListener("click", () => {
      PulsarGradleManagerView.clearMessages();

      if(SDebugLogging) {
        PulsarGradleManagerView.addTaggedLogMessage("LOG", "Gradle refresh!");
      }

      let tasks = [];

      PulsarGradleManagerView.addLogMessage("Fetching gradle tasks...");
      parser = new Parser();


      // TODO continue reading at about line 91 (output-view.js)

      const onTaskExit = (code) => {
        if (code === 0) {
          PulsarGradleManagerView.tasks = parser.parser();
          parser.close();
          PulsarGradleManagerView.addLogMessage(`${tasks.length} tasks found`);
        } else {
          PulsarGradleManagerView.onExitCode(code);
        }
      }

      Runner.getGradleTasks(PulsarGradleManagerView.onTaskOutput,
        PulsarGradleManagerView.onExitCode, onTaskExit);
    });
    header.appendChild(refreshButton);

    const clearButton = document.createElement("button");
    clearButton.classList.add("btn", "gradleIcon", "icon", "icon-trashcan", "inline-block-tight");
    clearButton.addEventListener("click", () => {
      PulsarGradleManagerView.clearMessages();
      if(SDebugLogging) {
        PulsarGradleManagerView.addTaggedLogMessage("LOG", "Gradle clear!");
      }
    });
    header.appendChild(clearButton);

    const dropDown = document.createElement("div");
    dropDown.classList.add("gradleDropDown");

    const dropDownMenu = document.createElement("div");
    dropDownMenu.classList.add("gradleDropDownMenu");
    dropDownMenu.id = "gradleDropDownMenu";

    // drop down for task selection
    const dropDownButton = document.createElement("button");
    dropDownButton.classList.add("btn", "gradleDropDownButton", "inline-block-tight");
    dropDownButton.addEventListener("click", () => {
      dropDownMenu.classList.toggle("gradleDropDownShow");
    });

    document.addEventListener("click", function(event) {
      if (!dropDown.contains(event.target)) {
        dropDownMenu.classList.remove("gradleDropDownShow");
      }
    });

    if (projectGradleFiles != "") {
      let gradleFileName = projectGradleFiles[0].split('\\');

      dropDownButton.textContent = gradleFileName[gradleFileName.length - 1];
      activeGradleFile = projectGradleFiles[0];

      let i;
      for (i = 0; i < projectGradleFiles.length; i++) {
        gradleFileName = projectGradleFiles[i].split('\\');

        const dropdownItem = document.createElement("button");
        dropdownItem.classList.add("btn", "gradleDropDownItem");
        dropdownItem.textContent = gradleFileName[gradleFileName.length - 1];
        // TODO on click listener
        dropdownItem.addEventListener("click", () => {
          dropDownButton.textContent = dropdownItem.textContent;
          activeGradleFile = projectGradleFiles[i];
        });

        dropDownMenu.appendChild(dropdownItem);
      }
    }

    dropDown.appendChild(dropDownMenu);
    dropDown.appendChild(dropDownButton);

    header.appendChild(dropDown);

    // input box
    const inputBox = document.createElement("input");
    inputBox.classList.add("input-text", "inline-block-tight", "native-key-bindings");
    inputBox.type = "text";
    inputBox.id = "gradleTask";
    inputBox.placeholder = "Fill in task/args and press play to run...";

    header.appendChild(inputBox);

    this.element.appendChild(header);

    const body = document.createElement("atom-panel");
    body.classList.add("padded", "BodyDiv");

    // basically a terminal of sorts, shows what the gradle is doing and its
    // status:

    const gradleLogger = document.createElement("div");
    gradleLogger.classList.add("gradleLogger", "inset-panel");
    gradleLogger.id = "gradleLogger";
    body.appendChild(gradleLogger);

    this.element.appendChild(body);
  }

  getTitle() {
    return "Gradle Manager";
  }

  getURI() {
    return "atom://gradle-manager"
  }

  getDefaultLocation() {
    return "bottom"
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      // This is used to look up the deserializer function. It can be any
      // string, but it needs to be unique across all packages!
      deserializer: "gradle-manager/PulsarGradleManagerView"
    };
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }
}
