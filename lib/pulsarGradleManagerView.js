"use babel";

const SDebugLogging = true;

const SLogColor     = "#8888ff";
const SErrColor     = "#ff8888";
const SWarnColor    = "#ffff88";
const SSuccColor    = "#88ff88";

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
      logMessage.classList.add("gradleLog");
      logMessage.style.color = `${SLogColor}`;
      logMessage.textContent = `[${tag}] - ${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addTaggedWarnMessage(tag, text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog");
      logMessage.style.color = `${SWarnColor}`;
      logMessage.textContent = `[${tag}] - ${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addTaggedErrorMessage(tag, text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog");
      logMessage.style.color = `${SErrColor}`;
      logMessage.textContent = `[${tag}] - ${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addTaggedSuccessMessage(tag, text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog");
      logMessage.style.color = `${SSuccColor}`;
      logMessage.textContent = `[${tag}] - ${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addLogMessage(text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog");
      logMessage.style.color = `${SLogColor}`;
      logMessage.textContent = `${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addWarnMessage(text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog");
      logMessage.style.color = `${SWarnColor}`;
      logMessage.textContent = `${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addErrorMessage(text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog");
      logMessage.style.color = `${SErrColor}`;
      logMessage.textContent = `${text}`;

      const gradleLogger = document.getElementById("gradleLogger");

      gradleLogger.appendChild(logMessage);
      gradleLogger.scrollTop = gradleLogger.scrollHeight;
  }

  static addSuccessMessage(text) {
      const logMessage = document.createElement("div");
      logMessage.classList.add("gradleLog");
      logMessage.style.color = `${SSuccColor}`;
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

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement("div");
    this.element.classList.add("pulsarGradleManagerView");

    const header = document.createElement("div");
    header.classList.add("HeaderDiv");

    // three buttons on left,
    // STOP | REFRESH | refresh with clock?

    const stopButton = document.createElement("button");
    stopButton.classList.add("btn", "gradleIcon", "icon", "icon-stop");
    stopButton.addEventListener("click", () => {
      if(SDebugLogging) {
        PulsarGradleManagerView.addTaggedLogMessage("LOG", "Gradle stop!");
      }

      PulsarGradleManagerView.addMessage("Task Stopped");
    });
    header.appendChild(stopButton);

    const refreshButton = document.createElement("button");
    refreshButton.classList.add("btn", "gradleIcon", "icon", "icon-sync");
    refreshButton.addEventListener("click", () => {
      PulsarGradleManagerView.clearMessages();

      if(SDebugLogging) {
        PulsarGradleManagerView.addTaggedLogMessage("LOG", "Gradle refresh!");
      }
    });
    header.appendChild(refreshButton);

    const clearButton = document.createElement("button");
    clearButton.classList.add("btn", "gradleIcon", "icon", "icon-trashcan");
    clearButton.addEventListener("click", () => {
      PulsarGradleManagerView.clearMessages();
      if(SDebugLogging) {
        PulsarGradleManagerView.addTaggedLogMessage("LOG", "Gradle clear!");
      }
    });
    header.appendChild(clearButton);

    // after the buttons, text:
    // Input Task/Args:

    const inputBoxText = document.createElement("b");
    inputBoxText.classList.add("gradleB");
    inputBoxText.textContent = " Input Task/Args: ";
    header.appendChild(inputBoxText);

    // input box
    const inputBox = document.createElement("input");
    inputBox.classList.add("gradleInput");
    inputBox.type = "text";
    inputBox.id = "gradleTask";
    inputBox.name = "gradleTask";
    inputBox.placeholder = "Fill in task and press enter to run...";

    header.appendChild(inputBox);

    this.element.appendChild(header);

    const body = document.createElement("div");
    body.classList.add("BodyDiv");

    // basically a terminal of sorts, shows what the gradle is doing and its
    // status:

    const gradleLogger = document.createElement("div");
    gradleLogger.classList.add("gradleLogger");
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

  // getAllowedLocations() {
  //   return ["left", "right", "bottom"]
  // }

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
