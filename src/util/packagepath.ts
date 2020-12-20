import { packagepath } from "../services";

let cache: string | undefined;

export const packagePath = (): string => {
  if (cache === undefined) {
    const pkgPath = packagepath();

    if (pkgPath) {
      cache = pkgPath;
    } else {
      return "";
    }
  }

  return cache;
};

export const reset = () => cache = undefined;

Object.freeze(packagePath);
