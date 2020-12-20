'use strict';

const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');
const packagepath = require('../../services/packagepath').packagepath;
const mainPackagepath = require('../../services/main.packagepath').mainPackagepath;

describe('#mainPackagepath()', () => {
  const pkgpath = packagepath();

  describe('#in main module', () => {
    let cwdStub;

    afterEach(() => {
      if (cwdStub) {
        cwdStub.restore();
        cwdStub = undefined;
      }
    });

    it('expect to get a path of package.json of the main module', () => {
      // arranges

      // acts
      const result = mainPackagepath();

      // asserts
      expect(result).to.equal(pkgpath);
    });

    it('expect to get a path of package.json of the main module', () => {
      // arranges
      cwdStub = sinon.stub(process, 'cwd');
      cwdStub.callsFake(() => `${pkgpath}/expected_path/expected_inner_path`);

      // acts
      const result = mainPackagepath();

      // asserts
      expect(result).to.equal(pkgpath);
    });
  });

  describe('#in dependency modules, #1', () => {
    let cwdStub;
    let existsStub;

    before(() => {
      const cwd = path.join(pkgpath, 'node_modules', 'dependency', 'testpath');
      cwdStub = sinon.stub(process, 'cwd');
      existsStub = sinon.stub(fs, 'existsSync');
      cwdStub.returns(cwd);
      existsStub.returns(true);
    });

    after(() => {
      cwdStub.restore();
      existsStub.restore();
    });

    it('expect to get a path of package.json of the main module from dependency modules', () => {
      // arranges

      // acts
      const result = mainPackagepath();

      // asserts
      expect(result).to.equal(pkgpath);
    });
  });

  describe('#in dependency modules, #2', () => {
    let cwdStub;
    let existsStub;

    before(() => {
      const cwd = path.join(pkgpath, 'fakepath', 'node_modules', 'dependency', 'testpath', 'testsubpath');
      const submodule_pkgjson = path.join(pkgpath, 'fakepath', 'node_modules', 'dependency', 'package.json');
      const pkgjson = path.join(pkgpath, 'package.json');
      cwdStub = sinon.stub(process, 'cwd');
      existsStub = sinon.stub(fs, 'existsSync');
      cwdStub.returns(cwd);
      existsStub.callsFake((v) => [pkgjson, submodule_pkgjson].indexOf(v) > -1);
    });

    after(() => {
      cwdStub.restore();
      existsStub.restore();
    });

    it('expect to get a path of package.json of the main module from dependency modules', () => {
      // arranges

      // acts
      const result = mainPackagepath();

      // asserts
      expect(result).to.equal(pkgpath);
    });
  });

  describe('#in non-exist module', () => {
    let cwdStub;

    before(() => {
      cwdStub = sinon.stub(process, 'cwd');
      cwdStub.callsFake(() => '/expected_path/expected_inner_path');
    });

    after(() => {
      cwdStub.restore();
    });

    it('expect to get "undefined" when the package.json cannot be found', () => {
      // arranges

      // acts
      const result = mainPackagepath();

      // asserts
      expect(result).to.be.undefined;
    });
  });
});
