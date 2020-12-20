'use strict';

const path = require('path');
const expect = require('chai').expect;
const packagePath = require('../../util/packagepath').packagePath;
const resolveRelative = require('../../util/resolverelative').resolveRelative;

describe('#resolveRelative()', () => {
  it('expect to get the relative path from the current path', () => {
    // arranges
    const fp = process.cwd();
    const expected = `.${path.sep}`

    // acts
    const result = resolveRelative(fp);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to get the relative path from the provided relative path', () => {
    // arranges
    const expected = "./relative/path";

    // acts
    const result = resolveRelative(expected);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to get the relative path from a path', () => {
    // arranges
    const pkgpath = packagePath();
    const fp1 = path.dirname(pkgpath);
    const fp2 = __dirname;
    const expected1 = path.join(path.relative(pkgpath, fp1), path.sep);
    const temp = path.join(path.relative(pkgpath, fp2), path.sep);
    const expected2 = `.${path.sep}${temp}`;

    // acts
    const result1 = resolveRelative(fp1);
    const result2 = resolveRelative(fp2);

    // asserts
    expect(result1).to.equal(expected1);
    expect(result2).to.equal(expected2);
  });

  it('expect to get the relative path from a file path', () => {
    // arranges
    const pkgpath = packagePath();
    const fp = __filename;
    const p = path.dirname(fp);
    const r = path.join(path.relative(pkgpath, p), path.sep);
    const expected = `.${path.sep}${r}`;

    // acts
    const result = resolveRelative(fp);

    // asserts
    expect(result).to.equal(expected);
  });
});
