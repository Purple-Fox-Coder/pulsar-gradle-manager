'use babel';

const { BufferedProcess } = require('atom');
const path = require('path');
const FileFinderUtil = require('./file-finder-util');
const util = require('util');

class GradleRunner {
  constructor() {
    this.fileFinderUtil = new FileFinderUtil();
    this.gradleHome = atom.config.get('gradle-manager.gradle_home');
  }

  getGradleTasks(onOutput, onError, onExit, args) {
    this.runGradle('tasks', onOutput, onError, onExit, args);
  }

  // TODO extend to be able to select the file to use
  runGradle(task, onOutput, stderr, exit, extraArgs) {
    const cwd = atom.project.getPaths()[0];

    if (this.process) {
      this.process.kill();
      this.process = null;
    }
    const win = process.platform.indexOf('win') !== -1;
    let command = '';
    const commands = this.fileFinderUtil.findFiles(win ? /^gradlew$/i : /^gradlew\.bat$/i);
    if (commands.length > 0) {
      command = commands[0];
    }
    if (command === '') {
      if (this.gradleHome && this.gradleHome.trim()) {
        command = win ? path.join(this.gradleHome, '/bin/gradle') : path.join(this.gradleHome, '/bin/gradle.bat');
      } else {
        command = win ? 'gradle' : 'gradle.bat';
      }
    }

    const args = [];
    for (const arg of task.split(' ')) {
      args.push(arg);
    }

    if (extraArgs) {
      for (const arg of extraArgs.split(' ')) {
        args.push(arg);
      }
    }
    onOutput(util.format('Path: "%s"', cwd), 'text-info');
    if (extraArgs) {
      onOutput(util.format('Execute: "%s %s %s"', command, task, extraArgs), 'text-info');
    } else {
      onOutput(util.format('Execute: "%s %s"', command, task), 'text-info');
    }
    this.process = new BufferedProcess({
      command: command,
      args: args,
      options: {
        env: process.env,
        cwd: cwd
      },
      stdout: onOutput,
      stderr: stderr,
      exit: exit
    });
  }

  destroy() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}

module.exports = GradleRunner;
