'use strict';

const path = require('path');
const expect = require('chai').expect;
const packagePath = require('../../util/packagepath').packagePath;
const resolveFile = require('../../util/resolvefile').resolveFile;

describe('#resolveFile()', () => {
  it('expect to get a file as relative path provided', () => {
    // arranges
    const pkgpath = packagePath();
    const file = './test/file.js';
    const expected = path.join(pkgpath, file);

    // acts
    const result = resolveFile(file);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to get a file as absolute path provided', () => {
    // arranges
    const abspath = process.cwd();
    const absfile = path.join(abspath, './test/file.js');
    const expected = absfile;

    // acts
    const result = resolveFile(absfile);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to throw an exception', () => {
    // arranges

    // acts
    const act = () => resolveFile();

    // asserts
    expect(act).to.throw(Error);
  });
});
