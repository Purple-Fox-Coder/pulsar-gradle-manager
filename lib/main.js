'use babel';

import PulsarGradleManagerView from "./views/pulsarGradleManagerView";
import { CompositeDisposable, Disposable } from 'atom';

const GpackageName = require("../package.json").name ?? "pulsar-gradle-manager";

function openConfig() {
  atom.workspace.open(`atom://config/packages/${g_packageName}`);
}

export default {
  config: {
    gradle_home: {
      type: 'string',
      title: 'Gradle Home (Default Use Environment)',
      description: "Gradle Home Dir",
      default: '',
      order: 1
    }
  },

	subscriptions: null,

	activate(state) {
    this.subscriptions = new CompositeDisposable(
			// Add an opener for our view.
			atom.workspace.addOpener((uri) => {
        if (uri === "atom://gradle-manager") {
          return new PulsarGradleManagerView();
				}
			}),

			// Register command that toggles this view
			atom.commands.add("atom-workspace", {
        "gradle-manager:toggle": () => this.toggle(),
			}),

			// Destroy any ActiveEditorInfoViews when the package is deactivated.
			new Disposable(() => {
				atom.workspace.getPaneItems().forEach((item) => {
          if (item instanceof PulsarGradleManagerView) {
						item.destroy();
					}
				});
			})
		);
	},

	deactivate() {
    this.subscriptions.dispose();
	},

	toggle() {
    atom.workspace.toggle('atom://gradle-manager');
	},

  deserializePulsarGradleManagerView(serialized) {
    return new PulsarGradleManagerView();
  }
};

// module.exports.config = {
//   gradle_home: {
//     type: 'string',
//     title: 'Gradle Home (Default Use Environment)',
//     description: "Gradle Home Dir",
//     default: '',
//     order: 1
//   }
// }
