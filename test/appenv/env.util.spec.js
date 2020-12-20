'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const os = require('os');
const mockRequire = require('mock-require');
const path = require('path');
const sinon = require('sinon');
const { packagepath } = require('../../services');
const { EnvUtil, EnvParser, parseValue } = require('../../appenv/env.util');

describe('parseValue()', () => {
  it('expect to parse a value, text - #1', () => {
    // arranges
    const val = "'text'";
    const expected = 'text';

    // acts
    const result = parseValue(val);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to parse a value, text - #2', () => {
    // arranges
    const val = " 'text' ";
    const expected = 'text';

    // acts
    const result = parseValue(val);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to parse a value, text - #3', () => {
    // arranges
    const val = ' text ';
    const expected = 'text';

    // acts
    const result = parseValue(val);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to parse a value, number - #1', () => {
    // arranges
    const val = "100";
    const expected = 100;

    // acts
    const result = parseValue(val);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to parse a value, number - #2', () => {
    // arranges
    const val = " 100 ";
    const expected = 100;

    // acts
    const result = parseValue(val);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to parse a value, array', () => {
    // arranges
    const val = "[1,2,3,\"a\",\"b\"]";
    const expected = [1, 2, 3, 'a', 'b'];

    // acts
    const result = parseValue(val);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to parse a value, object', () => {
    // arranges
    const val = "{\"a\":\"a\",\"b\":\"b\",\"c\":\"c\",\"x\":1,\"y\":2,\"z\":3}";
    const expected = {
      a: 'a',
      b: 'b',
      c: 'c',
      x: 1,
      y: 2,
      z: 3,
    };

    // acts
    const result = parseValue(val);

    // asserts
    expect(result).to.deep.equal(expected);
  });
});

describe('#EnvParser', () => {
  describe('EnvParser.parseDataLines()', () => {
    it('expect to parse data into lines', () => {
      // arranges
      const data = `host='local'${os.EOL}user='test'${os.EOL}value=12345`;
      const expected = [
        "host='local'",
        "user='test'",
        "value=12345",
      ];

      // acts
      const result = EnvParser.parseDataLines(data);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe('EnvParser.parseKeyValue()', () => {
    it('expect to parse a key value, #1', () => {
      // arranges
      const raw = 'host="local"';
      const expected = {
        key: 'host',
        value: 'local',
      };

      // acts
      const result = EnvParser.parseKeyValue(raw);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it('expect to parse a key value, #2', () => {
      // arranges
      const raw = 'value=12345';
      const expected = {
        key: 'value',
        value: 12345,
      };

      // acts
      const result = EnvParser.parseKeyValue(raw);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});

describe('#EnvUtil', () => {
  const pkgpath = packagepath();

  describe('EnvUtil.parseEnvData()', () => {
    it('expect to parse ENV format data', () => {
      // arranges
      const envData = `host='local'${os.EOL}user='test'${os.EOL}value=12345`;
      const expected = {
        host: 'local',
        user: 'test',
        value: 12345,
      };

      // acts
      const result = EnvUtil.parseEnvData(envData);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe('EnvUtil.readEnvFile()', () => {
    it('expect to read ENV file', () => {
      // arranges
      const envFilePath = path.join(pkgpath, './test/appenv/.env');
      const expected = `key='test'${os.EOL}value=1${os.EOL}array=[1,2,3]${os.EOL}`;

      // acts
      const result = EnvUtil.readEnvFile(envFilePath);

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('EnvUtil.resolveEnvFile()', () => {
    it('expect to get undefined as no .env files', () => {
      // arranges

      // acts
      const result = EnvUtil.resolveEnvFile(pkgpath);

      // asserts
      expect(result).to.be.undefined;
    });

    it('expect to resolve an .env file', () => {
      // arranges
      const configPath = path.join(pkgpath, './test/appenv');
      const expected = path.join(pkgpath, './test/appenv/.env');

      // acts
      const result = EnvUtil.resolveEnvFile(configPath);

      // asserts
      expect(result).to.equal(expected);
    });

    describe('#In case that only .env is on project path', () => {
      const envFilePath = path.join(pkgpath, '.env');
      const existsSync = fs.existsSync;
      const exists = [envFilePath];
      let fsExistStub;

      before(() => {
        fsExistStub = sinon.stub(fs, 'existsSync');
        fsExistStub.callsFake(val => {
          if (exists.indexOf(val) > -1) {
            return true;
          } else {
            return existsSync(val);
          }
        });
      });

      after(() => {
        fsExistStub.restore();
      });

      it('expect to resolve an .env file in package path as default path', () => {
        // arranges
        const testPath = path.join(pkgpath, './test');

        // acts
        const result = EnvUtil.resolveEnvFile(testPath);

        // asserts
        expect(result).to.equal(envFilePath);
      });

      it('expect to resolve undefined as useDefault set to false', () => {
        // arranges
        const testPath = path.join(pkgpath, './test');

        // acts
        const result = EnvUtil.resolveEnvFile(testPath, { useDefault: false });

        // asserts
        expect(result).to.equal(undefined);
      });

      it('expect to resolve a local.env file in package path', () => {
        // arranges
        const testPath = path.join(pkgpath, './test');
        const localEnvFilePath = path.join(pkgpath, 'local.env');
        exists.push(localEnvFilePath);

        // acts
        const result = EnvUtil.resolveEnvFile(testPath);

        // asserts
        expect(result).to.equal(localEnvFilePath);
      });
    });

    describe('#In case that .env is on project path and test.env is on specific path', () => {
      const envFilePath = path.join(pkgpath, '.env');
      const testEnvFilePath = path.join(pkgpath, 'test', 'test.env');
      const existsSync = fs.existsSync;
      const exists = [envFilePath, testEnvFilePath];
      let fsExistStub;

      before(() => {
        fsExistStub = sinon.stub(fs, 'existsSync');
        fsExistStub.callsFake(val => {
          if (exists.indexOf(val) > -1) {
            return true;
          } else {
            return existsSync(val);
          }
        });
      });

      after(() => {
        fsExistStub.restore();
      });

      it('expect to resolve an .env file', () => {
        // arranges
        const testPath = path.join(pkgpath, 'test');

        // acts
        const result = EnvUtil.resolveEnvFile(testPath);

        // asserts
        expect(result).to.equal(envFilePath);
      });

      it('expect to resolve a test.env file in specific path', () => {
        // arranges
        const testPath = path.join(pkgpath, 'test');

        // acts
        const result = EnvUtil.resolveEnvFile(testPath, { envName: 'test' });

        // asserts
        expect(result).to.equal(testEnvFilePath);
      });

      it('expect to resolve undefined as useDefault set to false', () => {
        // arranges
        const testPath = path.join(pkgpath, 'test');

        // acts
        const result = EnvUtil.resolveEnvFile(testPath, { useDefault: false });

        // asserts
        expect(result).to.equal(undefined);
      });

      it('expect to resolve undefined as envName is not found and useDefault set to false', () => {
        // arranges
        const testPath = path.join(pkgpath, 'test');

        // acts
        const result = EnvUtil.resolveEnvFile(testPath, { envName: 'another', useDefault: false });

        // asserts
        expect(result).to.equal(undefined);
      });

      it('expect to resolve an .env file as useDefault set to true', () => {
        // arranges
        const testPath = path.join(pkgpath, 'test');

        // acts
        const result = EnvUtil.resolveEnvFile(testPath, { envName: 'another', useDefault: true });

        // asserts
        expect(result).to.equal(envFilePath);
      });
    });

    describe('#In case that only test.env is on project path and set specific path', () => {
      const envFilePath = path.join(pkgpath, '.env');
      const testEnvFilePath = path.join(pkgpath, 'test.env');
      const existsSync = fs.existsSync;
      const exists = [envFilePath, testEnvFilePath];
      let fsExistStub;

      before(() => {
        fsExistStub = sinon.stub(fs, 'existsSync');
        fsExistStub.callsFake(val => {
          if (exists.indexOf(val) > -1) {
            return true;
          } else {
            return existsSync(val);
          }
        });
      });

      after(() => {
        fsExistStub.restore();
      });

      it('expect to resolve an .env file', () => {
        // arranges
        const othersPath = path.join(pkgpath, 'others');

        // acts
        const result = EnvUtil.resolveEnvFile(othersPath);

        // asserts
        expect(result).to.equal(envFilePath);
      });

      it('expect to resolve a test.env file in specific path', () => {
        // arranges
        const othersPath = path.join(pkgpath, 'others');

        // acts
        const result = EnvUtil.resolveEnvFile(othersPath, { envName: 'test' });

        // asserts
        expect(result).to.equal(testEnvFilePath);
      });

      it('expect to resolve undefined as useDefault set to false', () => {
        // arranges
        const othersPath = path.join(pkgpath, 'others');

        // acts
        const result = EnvUtil.resolveEnvFile(othersPath, { useDefault: false });

        // asserts
        expect(result).to.equal(undefined);
      });

      it('expect to resolve undefined as envName is not found and useDefault set to false', () => {
        // arranges
        const othersPath = path.join(pkgpath, 'others');

        // acts
        const result = EnvUtil.resolveEnvFile(othersPath, { envName: 'another', useDefault: false });

        // asserts
        expect(result).to.equal(undefined);
      });

      it('expect to resolve the test.env as specified envName and useDefault set to false', () => {
        // arranges
        const othersPath = path.join(pkgpath, 'others');

        // acts
        const result = EnvUtil.resolveEnvFile(othersPath, { envName: 'test', useDefault: false });

        // asserts
        expect(result).to.equal(testEnvFilePath);
      });

      it('expect to resolve an .env file as useDefault set to true', () => {
        // arranges
        const othersPath = path.join(pkgpath, 'others');

        // acts
        const result = EnvUtil.resolveEnvFile(othersPath, { envName: 'another', useDefault: true });

        // asserts
        expect(result).to.equal(envFilePath);
      });

      it('expect to resolve the test.env file as useDefault set to true', () => {
        // arranges
        const othersPath = path.join(pkgpath, 'others');

        // acts
        const result = EnvUtil.resolveEnvFile(othersPath, { envName: 'another', useDefault: true });

        // asserts
        expect(result).to.equal(envFilePath);
      });
    });
  });

  describe('EnvUtil.resolveEnv(), #1 - the file not exist', () => {
    it('expect to resolve the .env config', () => {
      // arranges

      // acts
      const result = EnvUtil.resolveEnv(pkgpath);

      // asserts
      expect(result).to.be.undefined;
    });
  });

  describe('EnvUtil.resolveEnv(), #2 - the file exist', () => {
    it('expect to resolve the .env config', () => {
      // arranges
      const configPath = path.join(pkgpath, './test/appenv');
      const expected = {
        key: 'test',
        value: 1,
        array: [1, 2, 3],
      };

      // acts
      const result = EnvUtil.resolveEnv(configPath);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe('EnvUtil.resolveEnv(), #3 - the local.env file exist', () => {
    let fsExistStub;
    let fsReadFileSyncStub;
    const existsSync = fs.existsSync;
    const readFileSync = fs.readFileSync;
    const localEnv = 'name="local"';
    const configPath = path.join(pkgpath, './test/appenv');

    before(() => {
      const localEnvFilePath = path.join(configPath, 'local.env');
      fsExistStub = sinon.stub(fs, 'existsSync');
      fsExistStub.callsFake(val => {
        if (val === localEnvFilePath) {
          return true;
        } else {
          return existsSync(val);
        }
      });

      fsReadFileSyncStub = sinon.stub(fs, 'readFileSync');
      fsReadFileSyncStub.callsFake((val, options) => {
        if (val === localEnvFilePath) {
          return localEnv;
        } else {
          return readFileSync(val, options);
        }
      });

      mockRequire(localEnvFilePath, localEnv);
    });

    after(() => {
      fsExistStub.restore();
      fsReadFileSyncStub.restore();
      mockRequire.stopAll();
    });

    it('expect to resolve the local.env config', () => {
      // arranges
      const expected = {
        name: 'local',
      };

      // acts
      const result = EnvUtil.resolveEnv(configPath);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
