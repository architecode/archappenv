import * as FS from "fs";
import * as Path from "path";
import { modulePath } from "./modulepath";
import { packagePath } from "./packagepath";
import { requireAsJSON } from "./requireasjson";

const ModuleLoader = {
  load: (resource: any) => require(resource),
};

const FileLoader = {
  load: (resource: any, base?: any) => {
    let fp;

    if (base !== undefined && base.length > 0) {
      if (Path.isAbsolute(base)) {
        fp = Path.join(base, resource);
      } else if (base[0] === ".") {
        fp = Path.join(packagePath(), base, resource);
      } else {
        fp = Path.join(modulePath(base), resource);
      }
    } else {
      if (Path.isAbsolute(resource)) {
        fp = resource;
      } else {
        fp = Path.join(packagePath(), resource);
      }
    }

    try {
      return require(fp);
    } catch (error) {
      throw new Error(`Loader Error: type: 'file', ${error}`);
    }
  },
};

const JSONLoader = {
  load: (resource: any, base?: any) => {
    const respath = base ? Path.join(base, resource) : resource;
    const fp = Path.isAbsolute(respath) ? respath : Path.join(packagePath(), respath);
    const ext = Path.extname(fp);

    try {
      if (ext.length === 0) {
        return require(fp);
      } else {
        return requireAsJSON(fp);
      }
    } catch (error) {
      throw new Error(`Loader Error: type: 'json', ${error}`);
    }
  },
};

const DirAsArrayLoader = {
  load: (resource: any, base?: any) => {
    const respath = base ? Path.join(base, resource) : resource;
    const fp = Path.isAbsolute(respath) ? respath : Path.join(packagePath(), respath);

    try {
      return FS.readdirSync(fp)
        .map((name) => Path.join(fp, name))
        .filter((filepath) => FS.statSync(filepath).isFile())
        .map((filepath) => require(filepath));
    } catch (error) {
      throw new Error(`Loader Error: type: 'dirAsArray', ${error}`);
    }
  },
};

const DirAsObjectLoader = {
  load: (resource: any, base?: any) => {
    const respath = base ? Path.join(base, resource) : resource;
    const fp = Path.isAbsolute(respath) ? respath : Path.join(packagePath(), respath);

    try {
      return FS.readdirSync(fp)
        .map((name) => ({ filepath: Path.join(fp, name), name: name.toLowerCase() }))
        .filter((each) => FS.statSync(each.filepath).isFile())
        .reduce((result: any, each) => {
          const ext = Path.extname(each.name);
          const basename = Path.basename(each.name, ext);
          const name = basename.split(".").reduce((r, n) => `${r}${n.charAt(0).toUpperCase()}${n.slice(1)}`, "");
          const key = `${name.charAt(0).toLowerCase()}${name.slice(1)}`;
          result[key] = require(each.filepath);

          return result;
        }, {});
    } catch (error) {
      throw new Error(`Loader Error: type: 'dirAsObject', ${error}`);
    }
  },
};

interface ILoadersMap {
  [key: string]: { load: (resource: any, options?: any) => any; };
}

export const loader = (() => {
  const initializeMap: () => ILoadersMap = () => ({
    module: ModuleLoader,
    file: FileLoader,
    json: JSONLoader,
    dirAsArray: DirAsArrayLoader,
    dirAsObject: DirAsObjectLoader,
  });

  let MAP = initializeMap();

  const LOADER = {
    resolve: (obj: { [key: string]: any; }) => {
      Object.keys(obj).forEach((key) => obj[key] = LOADER.resolveValue(obj[key]));
      return obj;
    },
    resolveValue: (val: { [key: string]: any; }) => {
      if (val.type && val.resource) {
        if (Object.prototype.hasOwnProperty.call(val, "$")) {
          if (val.$ === undefined || val.$ === null) {
            delete val.$;
          }
          return val;
        }

        const length = Object.keys(val).length;

        if ((length === 3 && val.options) || length === 2) {
          const { type, resource, options } = val;
          return LOADER.load(type, resource, options);
        }
      }
      return val;
    },
    load: (type: string, resource: any, options?: any) => {
      const strategy = MAP[type];

      if (strategy) {
        return strategy.load(resource, options);
      } else {
        throw new Error(`No Loader Error: Calling non-exist Loader with '${type}' type`);
      }
    },
    get: (type: string) => {
      return MAP[type];
    },
    set: (type: string, strategy: { load: (resource: any, options?: any) => any; }) => {
      MAP[type] = strategy;
      return LOADER;
    },
    types: () => {
      return [...Object.keys(MAP)];
    },
    reset: () => {
      MAP = initializeMap();
      return LOADER;
    },
  };

  return LOADER;
})();

Object.freeze(loader);
