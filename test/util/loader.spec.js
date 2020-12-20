'use strict';

const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');
const mock_require = require('mock-require');
const packagepath = require('../../services/packagepath').packagepath;
const loader = require('../../util/loader').loader;

const pkgpath = packagepath();

describe('#loader.js tests', () => {
  const predefined = {
    types: () => (['module', 'file', 'json', 'dirAsArray', 'dirAsObject'])
  };

  describe('#loader', () => {
    it('expect loader as singleton', () => {
      // arranges

      // acts
      const instance = loader;
      const another = loader;

      // asserts
      expect(instance).to.equal(another);
    });
  });

  describe('#types()', () => {
    it('expect to get all predefined types', () => {
      // arranges
      const expected = predefined.types();

      // acts
      const result = loader.types();

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });

  describe('#loader strategy with spyLoader', () => {
    const spyLoad = sinon.spy();
    const spyLoader = {
      load: spyLoad
    };

    after(() => loader.reset());

    describe('#set() and #get() tests', () => {
      it('expect to set and to get the loader strategy', () => {
        // arranges
        const types = predefined.types();
        types.push('testLoader');

        // acts
        loader.set('testLoader', spyLoader);
        const testStrategy = loader.get('testLoader');
        const testTypes = loader.types();

        // asserts
        expect(testStrategy).to.equal(spyLoader);
        expect(testTypes).to.deep.equal(types);
        expect(testTypes.length).to.equal(types.length);
      });
    });

    describe('#load() tests', () => {
      it('expect to load spyLoader as strategy with exactly arguments', () => {
        // arranges
        const resource = { value: 'R' };
        const options = { value: 'O' };

        // acts
        loader.load('testLoader', resource, options);

        // asserts
        expect(spyLoad.calledWithExactly(resource, options)).to.be.true;
        expect(spyLoad.callCount).to.equal(1);
      });

      it('expect to load "non-exist" loader and throw an error', () => {
        // arranges

        // acts
        const act = () => loader.load('nonexist', 'any');

        // asserts
        expect(act).to.throw(Error);
      });
    });

    describe('#reset() tests', () => {
      it('expect to reset the loader with only predefined strategies', () => {
        // arranges
        const expectedTypes = predefined.types();
        const arrangeTypes = loader.types();

        // acts
        loader.reset();
        const actTypes = loader.types();

        // asserts
        expect(actTypes).not.to.deep.equal(arrangeTypes);
        expect(arrangeTypes.length).to.equal(expectedTypes.length + 1);
        expect(actTypes).to.deep.equal(expectedTypes);
        expect(actTypes.length).to.equal(expectedTypes.length);
      });
    });
  });

  describe('#predefined loader: "module" loader', () => {
    const moduleResult = {};

    before(() => {
      mock_require('testModule', moduleResult);
    });

    after(() => {
      mock_require.stopAll();
    });

    it('expect to load with module loader', () => {
      // arranges
      const module_loader = loader.get('module');
      const moduleSpy = sinon.spy(module_loader, 'load');

      // acts
      const result = loader.load('module', 'testModule');

      // asserts
      expect(result).to.equal(moduleResult);
      expect(moduleSpy.callCount).to.equal(1);
      moduleSpy.restore();
    });

    it('expect to throw error when loading a non-exist module', () => {
      // arranges

      // acts
      const act = () => loader.load('module', 'non-exist');

      // asserts
      expect(act).to.throw(Error);
    });
  });

  describe('#predefined loader: "file" loader', () => {
    let fileSpy;

    before(() => {
      const file_loader = loader.get('file');
      fileSpy = sinon.spy(file_loader, 'load');
    });

    after(() => {
      fileSpy.restore();
    });

    afterEach(() => {
      fileSpy.resetHistory();
    });

    it('expect to load an absolute (*.js) file with file loader', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/js.js');

      // acts
      const result = loader.load('file', fp);

      // asserts
      expect(path.isAbsolute(fp)).to.be.true;
      expect(result.file).to.equal('js');
      expect(fileSpy.callCount).to.equal(1);
    });

    it('expect to load an absolute (*.json) file with file loader', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/json.json');

      // acts
      const result = loader.load('file', fp);

      // asserts
      expect(path.isAbsolute(fp)).to.be.true;
      expect(result.file).to.equal('json');
      expect(fileSpy.callCount).to.equal(1);
    });

    it('expect to load an absolute (*.*) file with file loader', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/x.config');

      // acts
      const result = loader.load('file', fp);

      // asserts
      expect(path.isAbsolute(fp)).to.be.true;
      expect(result.file).to.equal('config');
      expect(fileSpy.callCount).to.equal(1);
    });

    it('expect to load a file with file loader as relative-path base provided', () => {
      // arranges
      const resource = 'json';
      const base = './test/_resources/loader';

      // acts
      const result = loader.load('file', resource, base);

      // asserts
      expect(path.isAbsolute(base)).to.be.false;
      expect(result.file).to.equal('json');
      expect(fileSpy.callCount).to.equal(1);
    });

    it('expect to load a file with file loader as absolute-path base provided', () => {
      // arranges
      const resource = 'json';
      const base = path.join(pkgpath, './test/_resources/loader');

      // acts
      const result = loader.load('file', resource, base);

      // asserts
      expect(path.isAbsolute(base)).to.be.true;
      expect(result.file).to.equal('json');
      expect(fileSpy.callCount).to.equal(1);
    });

    it('expect to load a file with file loader as "module" base provided', () => {
      // arranges
      const resource = './package.json';
      const base = 'mocha';
      const resolvedPath = path.join(pkgpath, 'node_modules', base, resource);
      const expected = require(resolvedPath);

      // acts
      const result = loader.load('file', resource, base);

      // asserts
      expect(result).to.deep.equal(expected);
    });

    it('expect to load a relative file with file loader', () => {
      // arranges
      const fp = './test/_resources/loader/json.json';

      // acts
      const result = loader.load('file', fp);

      // asserts
      expect(path.isAbsolute(fp)).to.be.false;
      expect(result.file).to.equal('json');
      expect(fileSpy.callCount).to.equal(1);
    });

    it('expect to throw error when loading a non-exist file', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/non-exist');

      // acts
      const act = () => loader.load('file', fp);

      // asserts
      expect(act).to.throw(Error);
    });
  });

  describe('#predefined loader: "json" loader', () => {
    let jsonSpy;

    before(() => {
      const json_loader = loader.get('json');
      jsonSpy = sinon.spy(json_loader, 'load');
    });

    after(() => {
      jsonSpy.restore();
    });

    afterEach(() => {
      jsonSpy.resetHistory();
    });

    it('expect to load an absolute (*.json) file with json loader', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/json.json');

      // acts
      const result = loader.load('json', fp);

      // asserts
      expect(path.isAbsolute(fp)).to.be.true;
      expect(result.file).to.equal('json');
      expect(jsonSpy.callCount).to.equal(1);
    });

    it('expect to load an absolute (*.*) file with json loader', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/y.config');

      // acts
      const result = loader.load('json', fp);

      // asserts
      expect(path.isAbsolute(fp)).to.be.true;
      expect(result.file).to.equal('config');
      expect(jsonSpy.callCount).to.equal(1);
    });

    it('expect to load a file with json loader as base provided', () => {
      // arranges
      const resource = 'y.config';
      const base = path.join(pkgpath, './test/_resources/loader');

      // acts
      const result = loader.load('json', resource, base);

      // asserts
      expect(path.isAbsolute(resource)).to.be.false;
      expect(result.file).to.equal('config');
      expect(jsonSpy.callCount).to.equal(1);
    });

    it('expect to load a relative file with json loader', () => {
      // arranges
      const fp = './test/_resources/loader/y.config';

      // acts
      const result = loader.load('json', fp);

      // asserts
      expect(path.isAbsolute(fp)).to.be.false;
      expect(result.file).to.equal('config');
      expect(jsonSpy.callCount).to.equal(1);
    });

    it('expect to throw error when loading a non-exist file', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/non-exist');

      // acts
      const act = () => loader.load('json', fp);

      // asserts
      expect(act).to.throw(Error);
    });
  });

  describe('#predefined loader: "dirAsArray" loader', () => {
    let dirAsArraySpy;

    const expected = [{ file: 'config' }, { file: 'fname' }, { file: 'lname' }, { file: 'value' }];

    before(() => {
      const dirAsArray_loader = loader.get('dirAsArray');
      dirAsArraySpy = sinon.spy(dirAsArray_loader, 'load');
    });

    after(() => {
      dirAsArraySpy.restore();
    });

    afterEach(() => {
      dirAsArraySpy.resetHistory();
    });

    it('expect to load an absolute path with dirAsArray loader', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/dir');

      // acts
      const result = loader.load('dirAsArray', fp);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(dirAsArraySpy.callCount).to.equal(1);
    });

    it('expect to load a based path with dirAsArray loader', () => {
      // arranges
      const resource = 'dir';
      const base = path.join(pkgpath, './test/_resources/loader');

      // acts
      const result = loader.load('dirAsArray', resource, base);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(dirAsArraySpy.callCount).to.equal(1);
    });

    it('expect to load a relative path with dirAsArray loader', () => {
      // arranges
      const fp = './test/_resources/loader/dir';

      // acts
      const result = loader.load('dirAsArray', fp);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(dirAsArraySpy.callCount).to.equal(1);
    });

    it('expect to throw error when loading a non-exist directory', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/non-exist');

      // acts
      const act = () => loader.load('dirAsArray', fp);

      // asserts
      expect(act).to.throw(Error);
    });
  });

  describe('#predefined loader: dirAsObject loader', () => {
    let dirAsObjectSpy;

    const expected = {
      config: { file: 'config' },
      fnameService: { file: 'fname' },
      lnameService: { file: 'lname' },
      valueModule: { file: 'value' },
    };

    before(() => {
      const dirAsObject_loader = loader.get('dirAsObject');
      dirAsObjectSpy = sinon.spy(dirAsObject_loader, 'load');
    });

    after(() => {
      dirAsObjectSpy.restore();
    });

    afterEach(() => {
      dirAsObjectSpy.resetHistory();
    });

    it('expect to load an absolute path with dirAsObject loader', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/dir');

      // acts
      const result = loader.load('dirAsObject', fp);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(dirAsObjectSpy.callCount).to.equal(1);
    });

    it('expect to load a based path with dirAsArray loader', () => {
      // arranges
      const resource = 'dir';
      const base = path.join(pkgpath, './test/_resources/loader');

      // acts
      const result = loader.load('dirAsObject', resource, base);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(dirAsObjectSpy.callCount).to.equal(1);
    });

    it('expect to load a relative path with dirAsArray loader', () => {
      // arranges
      const fp = './test/_resources/loader/dir';

      // acts
      const result = loader.load('dirAsObject', fp);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(dirAsObjectSpy.callCount).to.equal(1);
    });

    it('expect to throw error when loading a non-exist directory', () => {
      // arranges
      const fp = path.join(pkgpath, './test/_resources/loader/non-exist');

      // acts
      const act = () => loader.load('dirAsObject', fp);

      // asserts
      expect(act).to.throw(Error);
    });
  });

  describe('#resolveValue()', () => {
    it('expect to resolve a plain value', () => {
      // arranges
      const val1 = 'string';
      const val2 = 0;
      const val3 = [0, 'string'];

      // acts
      const result1 = loader.resolveValue(val1);
      const result2 = loader.resolveValue(val2);
      const result3 = loader.resolveValue(val3);

      // asserts
      expect(result1).to.equal(val1);
      expect(result2).to.equal(val2);
      expect(result3).to.equal(val3);
    });

    it('expect to resolve a value', () => {
      // arranges
      const base = './test/_resources/loader';
      const val1 = { type: 'dirAsArray', resource: 'dir', options: base };
      const val2 = { type: 'file', resource: `${base}/x.config` };
      const val3 = { type: 'file', resource: `${base}/x.config`, $: null };
      const val4 = { type: 'file', resource: `${base}/x.config`, $: 'keep' };
      const val5 = { type: 'file', resource: `${base}/x.config`, value: 'value' };

      const expected1 = [{ file: 'config' }, { file: 'fname' }, { file: 'lname' }, { file: 'value' }];
      const expected2 = { file: 'config' };
      const expected3 = { type: 'file', resource: `${base}/x.config` };
      const expected4 = { type: 'file', resource: `${base}/x.config`, $: 'keep' };
      const expected5 = { type: 'file', resource: `${base}/x.config`, value: 'value' };

      // acts
      const result1 = loader.resolveValue(val1);
      const result2 = loader.resolveValue(val2);
      const result3 = loader.resolveValue(val3);
      const result4 = loader.resolveValue(val4);
      const result5 = loader.resolveValue(val5);

      // asserts
      expect(result1).to.deep.equal(expected1);
      expect(result2).to.deep.equal(expected2);
      expect(result3).to.deep.equal(expected3);
      expect(result4).to.deep.equal(expected4);
      expect(result5).to.deep.equal(expected5);
    });
  });

  describe('#resolve()', () => {
    it('expect to get all predefined types', () => {
      // arranges
      const base = './test/_resources/loader';
      const raw = {
        name: 'sample',
        services: { type: 'dirAsArray', resource: 'dir', options: base },
        config: { type: 'file', resource: `${base}/x.config` },
        plain: { type: 'file', resource: `${base}/x.config`, $: null },
        value: 0
      };
      const expected = {
        name: 'sample',
        services: [{ file: 'config' }, { file: 'fname' }, { file: 'lname' }, { file: 'value' }],
        config: { file: 'config' },
        plain: { type: 'file', resource: `${base}/x.config` },
        value: 0
      };

      // acts
      const result = loader.resolve(raw);

      // asserts
      expect(result).to.deep.equal(expected);
    });
  });
});
