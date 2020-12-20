import * as fs from "fs";
import * as Path from "path";
import { hostname, processArgv } from "../services";
import { findFilePaths, resolvePath } from "../util";
import { EnvUtil } from "./env.util";

let DefaultInstance: any;

const DEFINED = {
  defaultPath: resolvePath("./appenv"),
  configFile: "appenv.config.json",
  defaultFile: "default.appenv.js",
  localFile: "local.appenv.js",
  appenv: "appenv.js",
  hostname: hostname(),
  params: {
    type: "appenv-type",
    dir: "appenv-dir",
    t: "t",
    d: "d",
  },
};

export const AppEnvUtil = {
  resolveConfig: (configPath: string) => {
    const configFile = Path.join(configPath, DEFINED.configFile);
    if (fs.existsSync(configFile)) {
      return require(configFile);
    } else {
      return {};
    }
  },
  resolveAppEnvFile: (configPath: string, type?: string) => {
    if (type) {
      return Path.join(configPath, `${type}.${DEFINED.appenv}`);
    } else {
      const config = AppEnvUtil.resolveConfig(configPath);

      for (const key of Object.keys(config)) {
        const values: string[] = config[key];

        if (values.indexOf(DEFINED.hostname) > -1) {
          return Path.join(configPath, `${key}.${DEFINED.appenv}`);
        }
      }

      const localFile = Path.join(configPath, DEFINED.localFile);

      if (fs.existsSync(localFile)) {
        return localFile;
      } else {
        return Path.join(configPath, DEFINED.defaultFile);
      }
    }
  },
  resolveAppEnv: (configPath: string, type?: string, useDefault?: boolean) => {
    const appEnvFile = AppEnvUtil.resolveAppEnvFile(configPath, type);

    if (appEnvFile.indexOf(`default.${DEFINED.appenv}`) === -1 && fs.existsSync(appEnvFile)) {
      return require(appEnvFile);
    } else {
      const env = EnvUtil.resolveEnv(configPath, { envName: type, useDefault });

      if (env) {
        return env;
      }

      if (fs.existsSync(appEnvFile)) {
        return require(appEnvFile);
      } else {
        return {};
      }
    }
  },
  resolvePath: (dir?: string, type?: string) => {
    if (dir) {
      return resolvePath(dir);
    }

    if (type) {
      const file = `${type}.${DEFINED.appenv}`;
      const filePaths = findFilePaths(file);

      if (filePaths.length === 1) {
        return resolvePath(Path.dirname(filePaths[0]));
      }
    }

    for (const file of [DEFINED.configFile, DEFINED.localFile, DEFINED.defaultFile, DEFINED.appenv]) {
      const filePaths = findFilePaths(file);

      if (filePaths.length > 0) {
        return resolvePath(Path.dirname(filePaths[0]));
      }
    }

    return resolvePath(DEFINED.defaultPath);
  },
  compose: <T = any>(dir?: string, type?: string, useDefault?: boolean): T => {
    const configPath = AppEnvUtil.resolvePath(dir, type);
    useDefault = dir ? useDefault : useDefault || true;
    return AppEnvUtil.resolveAppEnv(configPath, type, useDefault);
  },
  resolveFromArgv: () => {
    const argv = processArgv([DEFINED.params.type, DEFINED.params.dir, DEFINED.params.t, DEFINED.params.d]);
    const type = argv[DEFINED.params.type] || argv[DEFINED.params.t];
    const dir = argv[DEFINED.params.dir] || argv[DEFINED.params.d];

    return { type, dir };
  },
  load: <T = any>(options?: { dir?: string; type?: string; useDefault?: boolean; }): T => {
    const argv = AppEnvUtil.resolveFromArgv();

    if (argv.type || argv.dir) {
      options = Object.assign({}, options, { type: argv.type, dir: argv.dir });
    }

    if (options) {
      const { dir, type, useDefault } = options;
      return AppEnvUtil.compose<T>(dir, type, useDefault);
    } else {
      if (!DefaultInstance) {
        DefaultInstance = AppEnvUtil.compose<T>();
      }
      return DefaultInstance;
    }
  },
  bind: <T = any>(options?: { dir?: string; type?: string; useDefault?: boolean; }): T => {
    const appenv = AppEnvUtil.load(options);
    Object.keys(appenv).forEach((key) => process.env[key] = appenv[key]);

    return appenv;
  },
  reset: () => {
    DefaultInstance = undefined;
  },
};

Object.freeze(AppEnvUtil);
