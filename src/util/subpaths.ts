import * as fs from "fs";
import * as Path from "path";
import { resolvePath } from "./resolvepath";

const defaultIgnores = [".git", "node_modules"];

export const subpathsSync = (path: string, ignores = defaultIgnores) => {
  path = resolvePath(path);
  let paths: string[] = [path];

  const subs = fs.readdirSync(path);
  subs.forEach((sub) => {
    if (ignores.indexOf(sub) === -1) {
      const subpath = Path.join(path, sub);
      const stat = fs.statSync(subpath);

      if (stat && stat.isDirectory()) {
        paths = paths.concat(subpathsSync(subpath, ignores));
      }
    }
  });

  return paths;
};

Object.freeze(subpathsSync);
