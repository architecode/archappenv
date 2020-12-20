import * as fs from "fs";
import * as Path from "path";

const nodeModules = "node_modules";

export const mainPackagepath = (): string | undefined => {
  const cwd = process.cwd();
  let base;

  if (cwd.indexOf(nodeModules) > -1) {
    base = cwd.split(nodeModules)[0];
  } else {
    base = cwd;
  }

  let pkgjson = Path.join(base, "package.json");

  if (fs.existsSync(pkgjson)) {
    return Path.join(base, Path.sep);
  } else {
    let currentPath = Path.dirname(base);
    let parentPath = Path.dirname(currentPath);

    while (currentPath !== parentPath) {
      pkgjson = Path.join(currentPath, "package.json");

      if (fs.existsSync(pkgjson)) {
        return Path.join(currentPath, Path.sep);
      }

      currentPath = parentPath;
      parentPath = Path.dirname(currentPath);
    }

    return undefined;
  }
};

Object.freeze(mainPackagepath);
