import * as Path from "path";
import { mainPackagepath } from "../services";

export const mainModuleName = (): string | undefined => {
  const pkgpath = mainPackagepath();
  if (pkgpath === undefined) {
    return undefined;
  }
  const pkgjson = Path.join(pkgpath, "package.json");
  return require(pkgjson).name;
};

Object.freeze(mainModuleName);
