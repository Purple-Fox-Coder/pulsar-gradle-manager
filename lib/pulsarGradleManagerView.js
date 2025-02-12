'use babel';

export default class PulsarGradleManagerView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('pulsarGradleManagerView');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The pulsarGradleManager package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);

    this.subscriptions = atom.workspace
      .getCenter()
      .observeActivePaneItem((item) => {
        if (!atom.workspace.isTextEditor(item)) {
          message.innerText = "Open a file to see important information about it.";
          return;
        }
        message.innerHTML = `
        <h2>${item.getFileName() || "untitled"}</h2>
        <ul>
          <li><b>Soft Wrap:</b> ${item.softWrapped}</li>
          <li><b>Tab Length:</b> ${item.getTabLength()}</li>
          <li><b>Encoding:</b> ${item.getEncoding()}</li>
          <li><b>Line Count:</b> ${item.getLineCount()}</li>
        </ul>
      `;
      });
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
  //   return ['left', 'right', 'bottom']
  // }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      // This is used to look up the deserializer function. It can be any
      // string, but it needs to be unique across all packages!
      deserializer: 'gradle-manager/PulsarGradleManagerView'
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
