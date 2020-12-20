import * as Path from "path";
import { packagePath } from "./packagepath";

export const resolvePath = (path?: string) => {
  if (path === undefined) {
    return packagePath();
  }

  if (Path.isAbsolute(path)) {
    return Path.join(path, Path.sep);
  } else {
    const pkgpath = packagePath();
    return Path.join(pkgpath, path, Path.sep);
  }
};

Object.freeze(resolvePath);
