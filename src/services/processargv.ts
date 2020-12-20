interface IProcessArgv {
  key: string;
  value: undefined | string | string[];
}

export const UTIL = {
  trim: (val: string) => {
    while (val.length && val[0] === "-") {
      val = val.slice(1);
    }

    return val;
  },
  processArgv: () => {
    const argvs = process.argv.slice(2);
    return argvs.reduce((result: string[][], each: string) => {
      if (each.length > 1 && each[0] === "-") {
        result.push([each]);
      } else {
        result[result.length - 1].push(each);
      }

      return result;
    }, [["_"]]);
  },
  mapProcessArgv: (argv: string[][]): IProcessArgv[] => {
    return argv.reduce((result: IProcessArgv[], each) => {
      const k = each[0];
      const v = each.slice(1);

      if (k === "_") {
        result.push({ key: k, value: v });
      } else if (k.length > 1 && k[1] === "-") {
        const key = UTIL.trim(k);
        const value = v.length === 0 ? undefined : v.length === 1 ? v[0] : v;
        result.push({ key, value });
      } else {
        const keys = UTIL.trim(k).split("");

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          let value;

          if (keys.length === v.length) {
            value = v[i];
          } else if (keys.length > v.length) {
            if (v.length > i) {
              value = v[i];
            } else {
              value = undefined;
            }
          } else {
            if (keys.length === i + 1) {
              value = v.slice(i);
            } else {
              value = v[i];
            }
          }

          result.push({ key, value });
        }
      }

      return result;
    }, []);
  },
  filterArgv: (argv: IProcessArgv[], filters: string[]) => {
    const match = (element: IProcessArgv, filtering: string[]) => {
      for (const each of filtering) {
        if (element.key.toUpperCase() === each.toUpperCase()) {
          return true;
        }
      }

      return false;
    };

    return argv.filter((each) => match(each, filters));
  },
  reduceArgv: (argv: IProcessArgv[]) => argv.reduce((result, each) => {
    result[each.key] = each.value;

    return result;
  }, {} as { [key: string]: any; }),
};

export const processArgv = (argv?: string | string[]) => {
  if (argv === undefined) {
    const pargv = UTIL.processArgv();
    const reduced = UTIL.mapProcessArgv(pargv);
    return UTIL.reduceArgv(reduced);
  } else if (typeof argv === "string") {
    const pargv = UTIL.processArgv();
    const reduced = UTIL.mapProcessArgv(pargv);
    const filtered = UTIL.filterArgv(reduced, [argv]);
    return UTIL.reduceArgv(filtered);
  } else if (Array.isArray(argv)) {
    const pargv = UTIL.processArgv();
    const reduced = UTIL.mapProcessArgv(pargv);
    const filtered = UTIL.filterArgv(reduced, argv);
    return UTIL.reduceArgv(filtered);
  }

  throw new TypeError("invalid type: only string and array of string are valid");
};

Object.freeze(processArgv);
