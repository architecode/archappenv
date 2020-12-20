'use strict';

const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');
const packagepath = require('../../services/packagepath').packagepath;

describe('#packagepath()', () => {
  let cwdStub;
  const cwd = process.cwd();

  afterEach(() => {
    if (cwdStub != undefined) {
      cwdStub.restore();
      cwdStub = undefined;
    }
  });

  it('expect to get a path of the package.json file when the module is located on package path', () => {
    // arranges
    const cwdpath = path.join(cwd, 'package.json');
    const expected = path.join(cwd, path.sep);

    // acts
    const exists = fs.existsSync(cwdpath);
    const pkgpath = packagepath();

    // asserts
    expect(exists).to.be.true;
    expect(pkgpath).to.equal(expected);
  });

  it("expect to get a path of the package.json file when the module isn't located on package path", () => {
    // arranges
    const expected = path.join(cwd, path.sep);

    cwdStub = sinon.stub(process, 'cwd');
    cwdStub.callsFake(() => path.join(cwd, 'fake', 'path'));
    const fakecwdpath = path.join(process.cwd(), 'package.json');

    // acts
    const exists = fs.existsSync(fakecwdpath);
    const pkgpath = packagepath();

    // asserts
    expect(exists).to.be.false;
    expect(pkgpath).to.equal(expected);
  });

  it('expect to get "undefined" when the package.json cannot be found', () => {
    // arranges
    cwdStub = sinon.stub(process, 'cwd')
    cwdStub.callsFake(() => '/');
    const fakecwdpath = path.join(process.cwd(), 'package.json');

    // acts
    const exists = fs.existsSync(fakecwdpath);
    const pkgpath = packagepath();

    // asserts
    expect(exists).to.be.false;
    expect(pkgpath).to.be.undefined;
  });
});
