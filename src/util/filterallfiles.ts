import * as FS from "fs";
import * as Path from "path";
import { resolvePath } from "./resolvepath";

export const filterAllFilesSync = (
  filter: (filepath: string) => boolean,
  basePath: string,
  deep: number = -1): string[] => {
  if (filter === undefined) {
    return [];
  }

  deep = deep < -1 ? -1 : deep;
  const resolvedPath = resolvePath(basePath);

  return FS.readdirSync(resolvedPath).reduce((result: string[], name) => {
    const value = Path.join(resolvedPath, name);
    const stat = FS.statSync(value);

    if (stat && stat.isFile()) {
      if (filter(value)) {
        result.push(value);
      }
      return result;
    } else if ((deep === -1 || deep > 0) && stat && stat.isDirectory()) {
      return result.concat(filterAllFilesSync(filter, value, deep === -1 ? -1 : deep - 1));
    } else {
      return result;
    }
  }, []);
};

Object.freeze(filterAllFilesSync);
