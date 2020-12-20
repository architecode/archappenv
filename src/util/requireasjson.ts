import * as fs from "fs";
import * as Path from "path";
import { resolvePath } from "./resolvepath";

export const requireAsJSON = (file: string, path?: string, encoding: BufferEncoding = "utf8") => {
  let absfile;

  if (Path.isAbsolute(file)) {
    absfile = file;
  } else {
    path = path === undefined ? resolvePath() : resolvePath(path);
    absfile = Path.join(path, file);
  }

  const content: any = fs.readFileSync(absfile, { encoding });

  return JSON.parse(content);
};

Object.freeze(requireAsJSON);
