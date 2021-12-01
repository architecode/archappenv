import * as Path from "path";
import { packagePath } from "./packagepath";

export const resolveFilePath = (type: "file" | "module", filepath: string, base?: string) => {
  const t = (type as string).toLowerCase();
  if (t === "file") {
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
  } else if (t === "module") {
    if (base === undefined) {
      if (filepath === undefined) {
        const pkgJSON = Path.join(packagePath(), "package.json");
        // eslint-disable-next-line @typescript-eslint/no-var-requires
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
    return undefined;
  }
};

Object.freeze(resolveFilePath);
