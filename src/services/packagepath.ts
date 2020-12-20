import * as fs from "fs";
import * as Path from "path";

export const packagepath = (): string | undefined => {
  const cwd = process.cwd();
  let pkgjson = Path.join(cwd, "package.json");

  if (fs.existsSync(pkgjson)) {
    return Path.join(cwd, Path.sep);
  } else {
    let currentPath = Path.dirname(cwd);
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

Object.freeze(packagepath);
