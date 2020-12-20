import * as fs from "fs";
import * as Path from "path";
import { packagePath } from "./packagepath";

export const resolveRelative = (abspath: string) => {
  if (!Path.isAbsolute(abspath)) {
    return abspath;
  } else {
    const stat = fs.statSync(abspath);
    let dir;

    if (stat && stat.isDirectory()) {
      dir = abspath;
    } else {
      dir = Path.dirname(abspath);
    }

    const pkgpath = packagePath();
    let relpath = Path.relative(pkgpath, dir);
    relpath = Path.join(relpath, Path.sep);

    if (relpath.charAt(0) !== "." && relpath.charAt(0) !== Path.sep) { relpath = `${Path.sep}${relpath}`; }

    if (relpath.charAt(0) !== ".") { relpath = `.${relpath}`; }

    return relpath;
  }
};

Object.freeze(resolveRelative);
