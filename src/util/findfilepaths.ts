import * as fs from "fs";
import * as Path from "path";
import { resolvePath } from "./resolvepath";
import { subpathsSync } from "./subpaths";

export const findFilePaths = (filename: string, path?: string, ignores?: string[]) => {
  path = resolvePath(path);
  const paths = subpathsSync(path, ignores);
  return paths
    .map((each) => Path.join(each, filename))
    .filter((filepath) => fs.existsSync(filepath));
};

Object.freeze(findFilePaths);
