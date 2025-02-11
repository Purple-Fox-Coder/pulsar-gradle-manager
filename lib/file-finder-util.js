const fs = require('fs');
const path = require('path');

class FileFinderUtil {
  static getRelativePath(filePath) {
    const [projectPath, relativePath] = atom.project.relativizePath(filePath);

    if (!(atom.project.getPaths().length > 1 && projectPath)) {
      return relativePath;
    }

    const dirs = projectPath.split(path.sep);
    return path.join(dirs[dirs.length - 1], relativePath);
  }

  static findFiles(regex) {
    const projPaths = atom.project.getPaths();

    return projPaths.filter((p) => {
      try {
        return fs.statSync(p).isDirectory();
      } catch {
        return false;
      }
    }).map((p) => this.findFilesHelper(p, regex))
      .reduce((results, files) => results.concat(files), []);
  }

  static findFilesHelper(cwd, regex) {
    const dirs = [];
    let files = [];
    let entries = [];

    try {
      entries = fs.readdirSync(cwd);
    } catch {
      return files;
    }

    for (const entry of entries) {
      if (entry.indexOf('.') !== 0) {
        if (regex.test(entry)) {
          files.push(path.join(cwd, entry));
        } else if (entry.indexOf('node_modules') === -1) {
          const abs = path.join(cwd, entry);
          try {
            if (fs.statSync(abs).isDirectory()) {
              dirs.push(abs);
            }
          } catch {}
        }
      }
    }

    for (const dir of dirs) {
      const foundFiles = this.findFilesHelper(dir, regex);
      if (foundFiles) {
        files = files.concat(foundFiles);
      }
    }

    return files;
  }
}

module.exports = FileFinderUtil;
