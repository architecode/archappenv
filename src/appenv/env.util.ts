import * as fs from "fs";
import * as os from "os";
import * as Path from "path";
import { packagePath } from "../util";

const DEFINED = {
  envFile: ".env",
  localEnvFile: "local.env",
  encoding: "utf8" as BufferEncoding,
  envPattern: /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/,
  numberPattern: /^-?\d*(\.\d+)?$/,
};

interface IEnvOptions {
  encoding?: BufferEncoding;
  envName?: string;
  useDefault?: boolean;
}

const isQuoted = (val: string) => {
  const length = val.length;

  return (val.charAt(0) === "\"" || val.charAt(0) === "'") &&
    (val.charAt(length - 1) === "\"" || val.charAt(length - 1) === "'");
};

const isJSON = (val: string) => {
  const length = val.length;

  return (val.charAt(0) === "[" || val.charAt(0) === "{") &&
    (val.charAt(length - 1) === "]" || val.charAt(length - 1) === "}");
};

const isNumber = (val: string) => DEFINED.numberPattern.test(val);

export const parseValue = (val: string) => {
  const value = val.trim();

  if (isQuoted(value)) {
    return value.replace(/(^['"]|['"]$)/g, "").trim();
  } else if (isJSON(value)) {
    return JSON.parse(value);
  } else if (isNumber(value)) {
    return Number(value);
  } else {
    return value;
  }
};

export const EnvParser = {
  parseDataLines: (raw: string) => raw.split(os.EOL),
  parseKeyValue: (raw: string): { key: string; value: any; } | undefined => {
    const matched = raw.match(DEFINED.envPattern);
    if (matched) {
      const key = matched[1];
      const value = parseValue(matched[2]);
      return {
        key,
        value,
      };
    } else {
      return undefined;
    }
  },
};

export const EnvUtil = {
  parseEnvData: (envData: string) => {
    return EnvParser.parseDataLines(envData).reduce((result: { [key: string]: any }, each) => {
      const kv = EnvParser.parseKeyValue(each);

      if (kv) {
        result[kv.key] = kv.value;
      }
      return result;
    }, {});
  },
  readEnvFile: (envFilePath: string, options: IEnvOptions = {}) => {
    const encoding = options.encoding || DEFINED.encoding;
    return fs.readFileSync(envFilePath, { encoding });
  },
  resolveCommonEnvFile: (configPath: string, useDefault = true) => {
    const pkgPath = packagePath();
    let localEnvFile = Path.join(configPath, `local${DEFINED.envFile}`);
    let envFile = Path.join(configPath, `${DEFINED.envFile}`);

    if (fs.existsSync(localEnvFile)) {
      return localEnvFile;
    }
    if (fs.existsSync(envFile)) {
      return envFile;
    }

    if (useDefault && pkgPath !== configPath) {
      localEnvFile = Path.join(pkgPath, `local${DEFINED.envFile}`);
      envFile = Path.join(pkgPath, `${DEFINED.envFile}`);

      if (fs.existsSync(localEnvFile)) {
        return localEnvFile;
      } else if (fs.existsSync(envFile)) {
        return envFile;
      }
    }

    return undefined;
  },
  resolveEnvFile: (configPath: string, options: IEnvOptions = {}) => {
    if (options.envName) {
      let envFile = Path.join(configPath, `${options.envName}${DEFINED.envFile}`);

      if (fs.existsSync(envFile)) {
        return envFile;
      }

      envFile = Path.join(packagePath(), `${options.envName}${DEFINED.envFile}`);

      if (fs.existsSync(envFile)) {
        return envFile;
      }

      if (options.useDefault) {
        return EnvUtil.resolveCommonEnvFile(configPath);
      } else {
        return undefined;
      }
    } else {
      return EnvUtil.resolveCommonEnvFile(configPath, options.useDefault);
    }
  },
  resolveEnv: (configPath: string, options: IEnvOptions = {}) => {
    const envFile = EnvUtil.resolveEnvFile(configPath, options);

    if (envFile) {
      const envData = EnvUtil.readEnvFile(envFile, options);
      const env = EnvUtil.parseEnvData(envData);
      return env;
    } else {
      return undefined;
    }
  },
};

Object.freeze(EnvUtil);
