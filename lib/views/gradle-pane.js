const { DockPaneView, Toolbar } = require('atom-bottom-dock');
const { Emitter, CompositeDisposable } = require('atom');
const OutputView = require('./output-view');
const ControlsView = require('./controls-view');
const FileFinderUtil = require('../file-finder-util');
const { $ } = require('space-pen');
const path = require('path');

class GradlePaneView extends DockPaneView {
  static content() {
    return this.div({ class: 'gradle-pane', style: 'display:flex;' }, () => {
      this.subview('toolbar', new Toolbar());
      this.subview('outputView', new OutputView());
    });
  }

  constructor() {
    super();
    this.fileFinderUtil = new FileFinderUtil();
    this.emitter = new Emitter();
    this.subscriptions = new CompositeDisposable();
    this.controlsView = new ControlsView();

    // Bind arrow functions to preserve lexical "this" as in CoffeeScript's fat arrow
    this.refresh = () => {
      this.outputView.refreshUIAndTask();
    };

    this.inputCustom = (task) => {
      const args = task.split(' ');
      if (args.length > 1) {
        this.outputView.runTask(args[0], args.join(' '));
      } else {
        this.outputView.runTask(task);
      }
    };

    this.stop = () => {
      this.outputView.stop();
    };

    this.clear = () => {
      this.outputView.clear();
    };

    this.outputView.show();

    this.toolbar.addLeftTile({ item: this.controlsView, priority: 0 });
    this.subscriptions.add(this.controlsView.onDidInputCustom(this.inputCustom));
    this.subscriptions.add(this.controlsView.onDidClickRefresh(this.refresh));
    this.subscriptions.add(this.controlsView.onDidClickStop(this.stop));
    this.subscriptions.add(this.controlsView.onDidClickClear(this.clear));

    this.outputView.refreshUIAndTask();
  }

  destroy() {
    this.outputView.destroy();
    this.subscriptions.dispose();
    this.remove();
  }
}

module.exports = GradlePaneView;
