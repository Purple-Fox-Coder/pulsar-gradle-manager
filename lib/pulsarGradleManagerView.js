"use babel";

export default class PulsarGradleManagerView {
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
      console.log("Gradle stop!");
    });
    header.appendChild(stopButton);

    const refreshButton = document.createElement("button");
    refreshButton.classList.add("btn", "gradleIcon", "icon", "icon-sync");
    refreshButton.addEventListener("click", () => {
      console.log("Gradle refresh!");
    });
    header.appendChild(refreshButton);

    const clearButton = document.createElement("button");
    clearButton.classList.add("btn", "gradleIcon", "icon", "icon-trashcan");
    clearButton.addEventListener("click", () => {
      console.log("Gradle clear!");

      // TODO figure out what the heck this is
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

    // TODO make this part

    this.element.appendChild(body);

    // example of safe dom way to do this
    // // Create message element
    // const message = document.createElement("div");
    // message.textContent = "The pulsarGradleManager package is Alive! It\"s ALIVE!";
    // message.classList.add("message");
    // this.element.appendChild(message);

    // this.subscriptions = atom.workspace
    //   .getCenter()
    //   .observeActivePaneItem((item) => {
    //     if (!atom.workspace.isTextEditor(item)) {
    //       message.innerText = "Open a file to see important information about it.";
    //       return;
    //     }
    //     message.innerHTML = "";
    //
    //     const heading = document.createElement("h2");
    //     heading.textContent = item.getFileName() || "untitled";
    //     message.appendChild(heading);
    //
    //     const list = document.createElement("ul");
    //
    //     // Create list items for each piece of information
    //     const softWrapItem = document.createElement("li");
    //     softWrapItem.innerHTML = `<b>Soft Wrap:</b> ${item.softWrapped}`;
    //     list.appendChild(softWrapItem);
    //
    //     const tabLengthItem = document.createElement("li");
    //     tabLengthItem.innerHTML = `<b>Tab Length:</b> ${item.getTabLength()}`;
    //     list.appendChild(tabLengthItem);
    //
    //     const encodingItem = document.createElement("li");
    //     const encodingText = document.createElement("b");
    //     encodingText.textContent = `Encoding: `;
    //     encodingItem.appendChild(encodingText);
    //
    //     const encodingTextOut = document.createElement("span");
    //     encodingTextOut.textContent = `${item.getEncoding()}`;
    //     encodingItem.appendChild(encodingTextOut);
    //
    //     list.appendChild(encodingItem);
    //
    //     const lineCountItem = document.createElement("li");
    //     lineCountItem.innerHTML = `<b>Line Count:</b> ${item.getLineCount()}`;
    //     list.appendChild(lineCountItem);
    //
    //     // Append the list to the message
    //     message.appendChild(list);
    //   });
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
