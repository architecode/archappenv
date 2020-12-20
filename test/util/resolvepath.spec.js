'use strict';

const path = require('path');
const expect = require('chai').expect;
const packagePath = require('../../util/packagepath').packagePath;
const resolvePath = require('../../util/resolvepath').resolvePath;

describe('#resolvePath()', () => {
  it('expect to get a path of package.json file as resolved path when no paths are provided', () => {
    // arranges
    const expected = packagePath();

    // acts
    const result = resolvePath();

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to get an absolute path as resolved path when the absolute path is provided', () => {
    // arranges
    const abspath = process.cwd();
    const expected = path.join(abspath, path.sep);

    // acts
    const result = resolvePath(abspath);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to get an absolute path as resolved path when the relative path is provided', () => {
    // arranges
    const relpath1 = ".";
    const relpath2 = "./";
    const relpath3 = "./rel/path";
    const pkgpath = packagePath();
    const expected1 = pkgpath;
    const expected2 = pkgpath;
    const expected3 = path.join(pkgpath, relpath3, path.sep);

    // acts
    const result1 = resolvePath(relpath1);
    const result2 = resolvePath(relpath2);
    const result3 = resolvePath(relpath3);

    // asserts
    expect(result1).to.equal(expected1);
    expect(result2).to.equal(expected2);
    expect(result3).to.equal(expected3);
  });
});
