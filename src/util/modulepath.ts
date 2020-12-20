import * as fs from "fs";
import * as Path from "path";
import { mainModuleName } from "./mainmodule.name";
import { packagePath } from "./packagepath";

const NODE_MODULES = "node_modules";

export const modulePath = (moduleName?: string) => {
  const pkgpath = packagePath();

  if (moduleName === undefined) {
    return pkgpath;
  } else if (moduleName === mainModuleName()) {
    return pkgpath;
  } else {
    const modulepath = Path.join(pkgpath, NODE_MODULES, moduleName, Path.sep);

    if (fs.existsSync(modulepath)) {
      return modulepath;
    } else {
      throw new Error(`Found No Module Name: ${moduleName}`);
    }
  }
};

Object.freeze(modulePath);
