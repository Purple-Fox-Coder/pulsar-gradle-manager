const { CompositeDisposable } = require('atom');
const { BasicTabButton } = require('atom-bottom-dock');

const GradlePane = require('./views/gradle-pane');
const FileFinderUtil = require('./file-finder-util');

module.exports = {
  config: {
    gradle_home: {
      type: 'string',
      title: 'Gradle Home (Default Use Environment)',
      default: '',
      description: "Gradle Home Dir"
    }
  },
  activate(state) {
    this.fileFinderUtil = new FileFinderUtil();
    this.win = process.platform.indexOf('win') !== -1;
    this.subscriptions = new CompositeDisposable();
    const packageFound = atom.packages.getAvailablePackageNames().indexOf('bottom-dock') !== -1;

    if (!packageFound) {
      atom.notifications.addError('Could not find Bottom-Dock', {
        detail: 'Gradle-Manager: The bottom-dock package is a dependency. \n' +
                'Learn more about bottom-dock here: https://atom.io/packages/bottom-dock',
        dismissable: true
      });
    }

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gradle-manager:add': () => this.add()
    }));
  },
  deleteCallback(id) {
    // console.log('test:' + this.newPane + id);
  },
  toggleCallback() {
    // console.log('click toggle');
  },
  consumeBottomDock(bottomDock) {
    this.bottomDock = bottomDock;
    this.bottomDock.onDidDeletePane(this.deleteCallback.bind(this));
    this.bottomDock.onDidToggle(this.toggleCallback.bind(this));
    const commands = this.fileFinderUtil.findFiles(this.win ? /^gradlew$/i : /^gradlew\.bat$/i);
    const gradleFiles = this.fileFinderUtil.findFiles(/^build.gradle$/i);
    if (commands.length > 0 || gradleFiles.length > 0) {
      this.add();
    }
  },
  add() {
    if (this.bottomDock) {
      this.newPane = new GradlePane();
      this.bottomDock.addPane(this.newPane, 'Gradle');
      console.log('isActive:' + this.bottomDock.isActive()); // Still output true without showing bottom-dock
      if (!this.bottomDock.isActive()) {
        this.bottomDock.toggle();
      }
    }
  },
  deactivate() {
    this.subscriptions.dispose();
    this.bottomDock.deletePane(this.newPane.getId());
  }
};
