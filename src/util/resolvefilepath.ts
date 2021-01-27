import * as Path from "path";
import { packagePath } from "./packagepath";

export const resolveFilePath = (type: "file" | "module", filepath: string, base?: string) => {
  if (type === "file") {
    if (base === undefined) {
      if (filepath === undefined) {
        return Path.join(packagePath(), "index.js");
      } else {
        if (Path.isAbsolute(filepath)) {
          return filepath;
        } else {
          return Path.join(packagePath(), filepath);
        }
      }
    } else {
      const absBase = Path.isAbsolute(base) ? base : Path.join(packagePath(), base);

      if (filepath === undefined) {
        return Path.join(absBase, "index.js");
      } else {
        if (Path.isAbsolute(filepath)) {
          return filepath;
        } else {
          return Path.join(absBase, filepath);
        }
      }
    }
  } else if (type === "module") {
    if (base === undefined) {
      if (filepath === undefined) {
        const pkgJSON = Path.join(packagePath(), "package.json");
        const main = require(pkgJSON).main;
        return Path.join(packagePath(), main);
      } else {
        if (Path.isAbsolute(filepath)) {
          return filepath;
        } else {
          return Path.join(packagePath(), filepath);
        }
      }
    } else {
      if (filepath === undefined) {
        return base;
      } else {
        return Path.join(packagePath(), "node_modules", base, filepath);
      }
    }
  } else {
    return false;
  }
};

Object.freeze(resolveFilePath);
