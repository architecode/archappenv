import * as Path from "path";
import { packagePath } from "./packagepath";

export const resolveFile = (file?: string) => {
  if (file === undefined) {
    throw new Error("NO FILE SPECIFIED");
  }

  if (Path.isAbsolute(file)) {
    return file;
  } else {
    const pkgpath = packagePath();
    return Path.join(pkgpath, file);
  }
};

Object.freeze(resolveFile);
