import * as FS from "fs";
import * as Path from "path";
import { resolvePath } from "./resolvepath";

export const allFilesSync = (basePath: string, deep: number = -1): string[] => {
  deep = deep < -1 ? -1 : deep;
  const resolvedPath = resolvePath(basePath);

  return FS.readdirSync(resolvedPath).reduce((result: string[], name) => {
    const value = Path.join(resolvedPath, name);
    const stat = FS.statSync(value);

    if (stat && stat.isFile()) {
      result.push(value);
      return result;
    } else if ((deep === -1 || deep > 0) && stat && stat.isDirectory()) {
      return result.concat(allFilesSync(value, deep === -1 ? -1 : deep - 1));
    } else {
      return result;
    }
  }, []);
};

Object.freeze(allFilesSync);
