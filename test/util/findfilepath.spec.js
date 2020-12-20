'use strict';

const path = require('path');
const expect = require('chai').expect;
const resolvePath = require('../../util/resolvepath').resolvePath;
const findFilePaths = require('../../util/findfilepaths').findFilePaths;

describe('#findFilePaths()', () => {
  it('expect to find all file paths in specified path and subpaths', () => {
    // arranges
    const ignores = ['.git', '.nyc_output', 'coverage', 'node_modules'];
    const filename = 'index.ts';
    const initpath = '.';
    const pkgpath = resolvePath(initpath);
    const expected = [
      './src/index.ts',
      './src/appenv/index.ts',
      './src/services/index.ts',
      './src/util/index.ts',
    ].map(p => path.resolve(pkgpath, p));

    // acts
    const result = findFilePaths(filename, initpath, ignores);

    // asserts
    expect(result).to.have.all.members(expected);
  });

  it('expect to find all file paths', () => {
    // arranges
    const ignores = ['.git', '.nyc_output', 'coverage', 'node_modules'];
    const filename = 'index.ts';
    const initpath = '.';
    const pkgpath = resolvePath(initpath);
    const expected = [
      './src/index.ts',
      './src/appenv/index.ts',
      './src/services/index.ts',
      './src/util/index.ts',
    ].map(p => path.resolve(pkgpath, p));

    // acts
    const result = findFilePaths(filename);

    // asserts
    expect(result).to.have.all.members(expected);
  });
});
