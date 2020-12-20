'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const mock_require = require('mock-require');
const path = require('path');
const sinon = require('sinon');
const { packagepath, hostname } = require('../../services');
const { AppEnvUtil } = require('../../appenv/appenv.util');

describe('#AppEnvUtil', () => {
  const pkgpath = packagepath();
  const _hostname = hostname();

  describe('AppEnvUtil.resolveConfig()', () => {
    let configFilePath;
    let configFileStub;
    let config;

    before(() => {
      config = { prod: [] };
      configFilePath = path.join(pkgpath, './test/_resources/appenv.config.json');
      configFileStub = sinon.stub(fs, 'existsSync').callsFake(v => [configFilePath].indexOf(v) > -1);
      mock_require(configFilePath, config);
    });

    after(() => {
      mock_require.stopAll();
      configFileStub.restore();
    });

    it('expect to resolve a config', () => {
      // arranges
      const configPath = AppEnvUtil.resolvePath('./test/_resources');

      // acts
      const result = AppEnvUtil.resolveConfig(configPath);

      // asserts
      expect(result).to.equal(config);
    });

    it('expect to resolve an empty config', () => {
      // arranges

      // acts
      const result = AppEnvUtil.resolveConfig(pkgpath);

      // asserts
      expect(result).to.deep.equal({});
    });
  });

  describe('With appenv.config.json, AppEnvUtil.resolveAppEnvFile(), #1 - on the app path', () => {
    let configFileStub;
    let appenvPath;
    const existsSyncItems = [];

    before(() => {
      appenvPath = AppEnvUtil.resolvePath();
      const config = { another: ['anotherhost'], prod: ['otherhost', _hostname] };
      const configFilePath = path.join(appenvPath, 'appenv.config.json');
      existsSyncItems.push(configFilePath);
      configFileStub = sinon.stub(fs, 'existsSync');
      configFileStub.callsFake(v => existsSyncItems.indexOf(v) > -1);
      mock_require(configFilePath, config);
    });

    after(() => {
      mock_require.stopAll();
      configFileStub.restore();
    });

    it('expect to load a default appenv file on the app path', () => {
      // arranges
      const expected = path.join(pkgpath, 'default.appenv.js');

      // acts
      const result = AppEnvUtil.resolveAppEnvFile(pkgpath);

      // asserts
      expect(result).to.equal(expected);
    });

    it('expect to load a specified appenv file on the app path', () => {
      // arranges
      const expected = path.join(appenvPath, 'prod.appenv.js');

      // acts
      const result = AppEnvUtil.resolveAppEnvFile(appenvPath);

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('With appenv.config.json, AppEnvUtil.resolveAppEnvFile(), #2 - on the specific path', () => {
    let configFileStub;
    let appenvPath;

    before(() => {
      appenvPath = path.join(pkgpath, 'appenv');
      const config = { another: ['anotherhost'], prod: ['hostname.01', 'hostname.02'] };
      const configFilePath = path.join(appenvPath, 'appenv.config.js');
      configFileStub = sinon.stub(fs, 'existsSync');
      configFileStub.callsFake(v => [configFilePath].indexOf(v) > -1);
      mock_require(configFilePath, config);
    });

    after(() => {
      mock_require.stopAll();
      configFileStub.restore();
    });

    it('expect to load a default appenv file on the specific path', () => {
      // arranges
      const expected = path.join(appenvPath, 'default.appenv.js');

      // acts
      const result = AppEnvUtil.resolveAppEnvFile(appenvPath);

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('Without appenv.config.json, AppEnvUtil.resolveAppEnvFile(), #1 - on the specific path', () => {
    let existsSyncStub;
    let appenvPath;

    before(() => {
      appenvPath = path.join(pkgpath, 'appenv');
      const localFilePath = path.join(appenvPath, 'local.appenv.js');
      existsSyncStub = sinon.stub(fs, 'existsSync');
      existsSyncStub.callsFake(v => [localFilePath].indexOf(v) > -1);
    });

    after(() => {
      existsSyncStub.restore();
    });

    it('expect to load a local appenv file on the specific path', () => {
      // arranges
      const expected = path.join(appenvPath, 'local.appenv.js');

      // acts
      const result = AppEnvUtil.resolveAppEnvFile(appenvPath);

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('AppEnvUtil.resolveAppEnv(), #1 - load an appenv file', () => {
    let configFileStub;
    let appenvPath;
    const appenvMock = { environment: 'test' };
    const files = [];

    before(() => {
      appenvPath = path.join(pkgpath, 'appenv');
      const config = { test: [_hostname] };
      const configFilePath = path.join(appenvPath, 'appenv.config.json');
      files.push(configFilePath);

      const appenvFilePath = path.join(appenvPath, 'test.appenv.js');
      files.push(appenvFilePath);

      configFileStub = sinon.stub(fs, 'existsSync');
      configFileStub.callsFake(v => files.indexOf(v) > -1);

      mock_require(configFilePath, config);
      mock_require(appenvFilePath, appenvMock);
    });

    after(() => {
      mock_require.stopAll();
      configFileStub.restore();
    });

    it('expect to load the appenv file', () => {
      // arranges

      // acts
      const result = AppEnvUtil.resolveAppEnv(appenvPath);

      // asserts
      expect(result).to.equal(appenvMock);
    });
  });

  describe('AppEnvUtil.resolveAppEnv(), #2 - load a .env file', () => {
    it('expect to load the .env file', () => {
      // arranges
      const configPath = path.join(pkgpath, 'test/appenv');
      const expected = {
        key: 'test',
        value: 1,
        array: [1, 2, 3],
      };

      // acts
      const result = AppEnvUtil.resolveAppEnv(configPath);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe('AppEnvUtil.resolveAppEnv(), #3 - load default value as no files exist', () => {
    it('expect to get default', () => {
      // arranges
      const configPath = path.join(pkgpath, 'appenv');
      const expected = {};

      // acts
      const result = AppEnvUtil.resolveAppEnv(configPath);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe('AppEnvUtil.resolvePath(), #1 - in case of type provided as using [specified].appenv.js', () => {
    const specifiedFilePath = path.join(pkgpath, './test/_resources/specified.appenv.js');

    before(() => {
      fs.writeFileSync(specifiedFilePath, '');
    });

    after(() => {
      fs.unlinkSync(specifiedFilePath);
    });

    it('expect to load a path with specified type', () => {
      // arranges
      const relative = './test/_resources';
      const expected = path.join(pkgpath, relative, path.sep);

      // acts
      const result = AppEnvUtil.resolvePath(undefined, "specified");

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('AppEnvUtil.resolvePath(), #2 - in case of type provided as using [specified].appenv.js, but not exist', () => {
    it('expect to load a default path as the specified type not exist', () => {
      // arranges
      const relative = './appenv';
      const expected = path.join(pkgpath, relative, path.sep);

      // acts
      const result = AppEnvUtil.resolvePath(undefined, "specified");

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('AppEnvUtil.resolvePath(), #3 - in case of appenv.config.js file not exist', () => {
    it('expect to load a default path', () => {
      // arranges
      const expected = path.join(pkgpath, 'appenv', path.sep);

      // acts
      const result = AppEnvUtil.resolvePath();

      // asserts
      expect(result).to.equal(expected);
    });

    it('expect to load a path with relative path', () => {
      // arranges
      const relative = './config';
      const expected = path.join(pkgpath, relative, path.sep);

      // acts
      const result = AppEnvUtil.resolvePath(relative);

      // asserts
      expect(path.isAbsolute(relative)).to.be.false;
      expect(result).to.equal(expected);
    });

    it('expect to load a path with absolute path', () => {
      // arranges
      const absolute = path.join(pkgpath, 'config', path.sep);

      // acts
      const result = AppEnvUtil.resolvePath(absolute);

      // asserts
      expect(path.isAbsolute(absolute)).to.be.true;
      expect(result).to.equal(absolute);
    });
  });

  describe('AppEnvUtil.resolvePath(), #4 - in case of appenv.config.json file exist', () => {
    const configFilePath = path.join(pkgpath, './test/_resources/appenv.config.json');

    before(() => {
      fs.writeFileSync(configFilePath, '');
    });

    after(() => {
      fs.unlinkSync(configFilePath);
    });

    it('expect to load a config path from appenv.config.json file', () => {
      // arranges
      const expected = path.join(pkgpath, 'test/_resources', path.sep);

      // acts
      const result = AppEnvUtil.resolvePath();

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('AppEnvUtil.resolvePath(), #5 - in case of default.appenv.js file exist', () => {
    const defaultFilePath = path.join(pkgpath, './test/_resources/default.appenv.js');

    before(() => {
      fs.writeFileSync(defaultFilePath, '');
    });

    after(() => {
      fs.unlinkSync(defaultFilePath);
    });

    it('expect to load a config path from default.appenv.js file', () => {
      // arranges
      const expected = path.join(pkgpath, 'test/_resources', path.sep);

      // acts
      const result = AppEnvUtil.resolvePath();

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('AppEnvUtil.resolvePath(), #6 - in case of local.appenv.js file exist', () => {
    const localFilePath = path.join(pkgpath, './test/_resources/local.appenv.js');

    before(() => {
      fs.writeFileSync(localFilePath, '');
    });

    after(() => {
      fs.unlinkSync(localFilePath);
    });

    it('expect to load a config path from local.appenv.js file', () => {
      // arranges
      const expected = path.join(pkgpath, 'test/_resources', path.sep);

      // acts
      const result = AppEnvUtil.resolvePath();

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('AppEnvUtil.resolvePath(), #7 - in case of both default.appenv.js and local.appenv.js files exist', () => {
    const defaultFilePath = path.join(pkgpath, './test/_resources/default.appenv.js');
    const localFilePath = path.join(pkgpath, './test/local.appenv.js');

    before(() => {
      fs.writeFileSync(defaultFilePath, '');
      fs.writeFileSync(localFilePath, '');
    });

    after(() => {
      fs.unlinkSync(defaultFilePath);
      fs.unlinkSync(localFilePath);
    });

    it('expect to load a config path from local.appenv.js file as higher prioritized', () => {
      // arranges
      const expected = path.join(pkgpath, 'test', path.sep);

      // acts
      const result = AppEnvUtil.resolvePath();

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('AppEnvUtil.resolvePath(), #8 - in case of appenv.js file exist', () => {
    const appenvFilePath = path.join(pkgpath, './test/appenv.js');

    before(() => {
      fs.writeFileSync(appenvFilePath, '');
    });

    after(() => {
      fs.unlinkSync(appenvFilePath);
    });

    it('expect to load a config path from appenv.js file', () => {
      // arranges
      const expected = path.join(pkgpath, 'test', path.sep);

      // acts
      const result = AppEnvUtil.resolvePath();

      // asserts
      expect(result).to.equal(expected);
    });
  });

  describe('AppEnvUtil.compose()', () => {
    let existsSyncStub;

    before(() => {
      const configPath = path.join(pkgpath, 'appenv');
      const configFile = path.join(configPath, 'appenv.config.js');
      const defaultAppEnvFile = path.join(configPath, 'default.appenv.js');
      const testAppEnvFile = path.join(configPath, 'test.appenv.js');
      const defaultAppEnv = { value: 'default' };
      const testAppEnv = { value: 'test' };
      existsSyncStub = sinon.stub(fs, 'existsSync');
      existsSyncStub.callsFake(v => [configFile, defaultAppEnvFile, testAppEnvFile].indexOf(v) > -1);
      mock_require(configFile, {});
      mock_require(defaultAppEnvFile, defaultAppEnv);
      mock_require(testAppEnvFile, testAppEnv);
    });

    after(() => {
      mock_require.stopAll();
      existsSyncStub.restore();
    });

    afterEach(() => {
      AppEnvUtil.reset();
    });

    it('expect to compose an instance', () => {
      // arranges
      const expected = { value: 'default' };

      // acts
      const appenv = AppEnvUtil.compose();

      // asserts
      expect(appenv).to.deep.equal(expected);
    });

    it('expect to compose a type-specified instance', () => {
      // arranges
      const expected = { value: 'test' };

      // acts
      const env = AppEnvUtil.compose(undefined, 'test');

      // asserts
      expect(env).to.deep.equal(expected);
    });
  });

  describe('AppEnvUtil.resolveFromArgv()', () => {
    let argv;

    before(() => {
      argv = [...process.argv];
    });

    afterEach(() => {
      AppEnvUtil.reset();
      process.argv = [...argv];
    });

    it('expect to resolve type and dir from process.argv, #1 both with full argv', () => {
      // arranges
      process.argv.push('--appenv-type');
      process.argv.push('params');
      process.argv.push('--appenv-dir');
      process.argv.push('./test/appenv');
      const expected = {
        type: 'params',
        dir: './test/appenv',
      };

      // acts
      const options = AppEnvUtil.resolveFromArgv();

      // asserts
      expect(options).to.deep.equal(expected);
    });

    it('expect to resolve type and dir from process.argv, #2 both with short argv', () => {
      // arranges
      process.argv.push('-t');
      process.argv.push('params');
      process.argv.push('-d');
      process.argv.push('./test/appenv');
      const expected = {
        type: 'params',
        dir: './test/appenv',
      };

      // acts
      const options = AppEnvUtil.resolveFromArgv();

      // asserts
      expect(options).to.deep.equal(expected);
    });

    it('expect to resolve type and dir from process.argv, #3 only type argv', () => {
      // arranges
      process.argv.push('-t');
      process.argv.push('params');
      const expected = {
        type: 'params',
        dir: undefined,
      };

      // acts
      const options = AppEnvUtil.resolveFromArgv();

      // asserts
      expect(options).to.deep.equal(expected);
    });

    it('expect to resolve type and dir from process.argv, #4 only dir argv', () => {
      // arranges
      process.argv.push('-d');
      process.argv.push('./test/appenv');
      const expected = {
        type: undefined,
        dir: './test/appenv',
      };

      // acts
      const options = AppEnvUtil.resolveFromArgv();

      // asserts
      expect(options).to.deep.equal(expected);
    });

    it('expect to resolve type and dir from process.argv, #5 none argv', () => {
      // arranges
      const expected = {
        type: undefined,
        dir: undefined,
      };

      // acts
      const options = AppEnvUtil.resolveFromArgv();

      // asserts
      expect(options).to.deep.equal(expected);
    });
  });

  describe('AppEnvUtil.load()', () => {
    afterEach(() => {
      AppEnvUtil.reset();
    });

    it('expect to load a default instance', () => {
      // arranges
      const expected = {};

      // acts
      const appenv = AppEnvUtil.load();
      const other = AppEnvUtil.load();

      // asserts
      expect(appenv).to.equal(other);
      expect(appenv).to.deep.equal(expected);
    });

    it('expect to call AppEnvUtil.compose()', () => {
      // arranges

      // acts
      const appenv = AppEnvUtil.load({ type: 'test' });
      const other = AppEnvUtil.load();

      // asserts
      expect(appenv).not.to.equal(other);
      expect(appenv).not.to.deep.equal(other);
    });
  });

  describe('AppEnvUtil.bind()', () => {
    let argv;

    before(() => {
      argv = [...process.argv];
    });

    afterEach(() => {
      AppEnvUtil.reset();
      process.argv = [...argv];
    });

    it('expect to load a default instance when bind with no options', () => {
      // arranges
      const expected = {};
      const appenv = AppEnvUtil.load();

      // acts
      const other = AppEnvUtil.bind();

      // asserts
      expect(appenv).to.equal(other);
      expect(appenv).to.deep.equal(expected);
    });

    it('expect to bind values to process.env', () => {
      // arranges
      const expected = {
        a: '_a',
        b: '_b',
      };

      // acts
      const appenv = AppEnvUtil.bind({ type: 'test', dir: './test/appenv' });

      // asserts
      expect(appenv).to.deep.equal(expected);
      expect(process.env.a).to.equal(expected.a);
      expect(process.env.b).to.equal(expected.b);
    });

    it('expect to bind values to process.env when specified params, #1', () => {
      // arranges
      process.argv.push('--appenv-type');
      process.argv.push('params');
      process.argv.push('--appenv-dir');
      process.argv.push('./test/appenv');
      const expected = {
        x: '_x',
        y: '_y',
        z: '_z',
      };

      // acts
      const appenv = AppEnvUtil.bind();

      // asserts
      expect(appenv).to.deep.equal(expected);
      expect(process.env.x).to.equal(expected.x);
      expect(process.env.y).to.equal(expected.y);
      expect(process.env.z).to.equal(expected.z);
    });

    it('expect to bind values to process.env when specified params, #2', () => {
      // arranges
      process.argv.push('-t');
      process.argv.push('params');
      process.argv.push('-d');
      process.argv.push('./test/appenv');
      const expected = {
        x: '_x',
        y: '_y',
        z: '_z',
      };

      // acts
      const appenv = AppEnvUtil.bind();

      // asserts
      expect(appenv).to.deep.equal(expected);
      expect(process.env.x).to.equal(expected.x);
      expect(process.env.y).to.equal(expected.y);
      expect(process.env.z).to.equal(expected.z);
    });

    it('expect to bind values to process.env when specified params, #3', () => {
      // arranges
      process.argv.push('-t');
      process.argv.push('params');
      process.argv.push('--appenv-type');
      process.argv.push('test');
      process.argv.push('-d');
      process.argv.push('./test/appenv');
      const expected = {
        a: '_a',
        b: '_b',
      };

      // acts
      const appenv = AppEnvUtil.bind();

      // asserts
      expect(appenv).to.deep.equal(expected);
      expect(process.env.a).to.equal(expected.a);
      expect(process.env.b).to.equal(expected.b);
    });
  });
});
