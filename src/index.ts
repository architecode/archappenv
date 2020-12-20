import {
  bind,
  load,
} from "./appenv";

import {
  AppEnvUtil,
} from "./appenv/appenv.util";

import {
  hostname,
  mainPackagepath,
  packagepath,
  processArgv,
} from "./services";

import {
  allFilesSync,
  composeInitialize,
  filterAllFilesSync,
  findFilePaths,
  isNullOrUndefined,
  loader,
  mainModuleName,
  modulePath,
  packageJSON,
  packagePath,
  requireAsJSON,
  resolveFile,
  resolveFilePath,
  resolvePath,
  resolveRelative,
  subpathsSync,
} from "./util";


export const Services = {
  hostname,
  mainPackagepath,
  packagepath,
  processArgv,
};

export const Util = {
  allFilesSync,
  composeInitialize,
  filterAllFilesSync,
  findFilePaths,
  isNullOrUndefined,
  loader,
  mainModuleName,
  modulePath,
  packageJSON,
  packagePath,
  requireAsJSON,

  resolveFilePath,
  resolveFile,
  resolvePath,
  resolveRelative,
  subpathsSync,
};

export const AppEnv = {
  bind,
  load,
  AppEnvUtil,
  Services,
  Util,
};

Object.freeze(AppEnv);
Object.freeze(Services);
Object.freeze(Util);
