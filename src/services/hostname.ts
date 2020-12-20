import * as os from "os";

export const hostname = () => os.hostname();

Object.freeze(hostname);
