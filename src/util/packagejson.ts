import * as Path from "path";
import { packagePath } from "./packagepath";

export const packageJSON = () => Path.join(packagePath(), "package.json");

Object.freeze(packageJSON);
