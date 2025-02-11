'use strict';

const { DockPaneView } = require('atom-bottom-dock');
const { Emitter, CompositeDisposable } = require('atom');
const { $ } = require('space-pen');

class ControlsView extends DockPaneView {
  static content() {
    return this.div(() => {
      this.span({ outlet: 'stopButton', class: 'stop-button icon icon-primitive-square', click: 'onStopClicked' });
      this.span({ outlet: 'refreshButton', class: 'refresh-button icon icon-sync', click: 'onRefreshClicked' });
      this.span({ outlet: 'clearButton', class: 'clear-button icon icon-history', click: 'onClearClicked' });
      this.span({ class: 'args-input-label' }, 'Input Task(And Args)::');
    });
  }

  constructor(...args) {
    super(...args);
    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();

    // Bind the onFetchArgsChanged method to preserve lexical scoping like CoffeeScript fat arrow
    this.onFetchArgsChanged = this.onFetchArgsChanged.bind(this);

    this.setupCustomTaskInput();
  }

  setupCustomTaskInput() {
    this.argsInput = document.createElement('atom-text-editor');
    this.argsInput.classList.add('text-editor');
    this.argsInput.setAttribute('mini', '');
    this.argsInput.getModel().setPlaceholderText('Press Enter to run (Example:tasks --info)');
    this.argsInput.addEventListener('keyup', this.onFetchArgsChanged);

    this.append(this.argsInput);
  }

  onDidClickRefresh(callback) {
    this.emitter.on('button:refresh:clicked', callback);
  }

  onDidClickStop(callback) {
    this.emitter.on('button:stop:clicked', callback);
  }

  onDidClickClear(callback) {
    this.emitter.on('button:clear:clicked', callback);
  }

  onDidInputCustom(callback) {
    this.emitter.on('input:custom:clicked', callback);
  }

  onRefreshClicked() {
    this.emitter.emit('button:refresh:clicked');
  }

  onStopClicked() {
    this.emitter.emit('button:stop:clicked');
  }

  onClearClicked() {
    this.emitter.emit('button:clear:clicked');
  }

  onFetchArgsChanged(e) {
    if (!(e.keyCode === 13 && this.argsInput.getModel().getText())) {
      return;
    }
    this.emitter.emit('input:custom:clicked', this.argsInput.getModel().getText());
  }
}

module.exports = ControlsView;
