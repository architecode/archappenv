'use strict';

const path = require('path');
const expect = require('chai').expect;
const resolvePath = require('../../util/resolvepath').resolvePath;
const allFilesSync = require('../../util/allfiles').allFilesSync;

describe('#util/allfiles.js', () => {
  it('expect to get an array of all files in specified path and default level', () => {
    // arranges
    const basePath = resolvePath('./test/_resources');
    const expected = [
      './jsons/jsoninside.jsin',
      './loader/dir/config.js',
      './loader/dir/fname.service.js',
      './loader/dir/lname.service.js',
      './loader/dir/value.module.js',
      './loader/js.js',
      './loader/json.json',
      './loader/x.config',
      './loader/y.config'
    ].map(each => path.join(basePath, each));

    // acts
    const result = allFilesSync(basePath);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an empty array if no files in current path with level 0', () => {
    // arranges
    const basePath = resolvePath('./test/_resources');
    const expected = [];

    // acts
    const result = allFilesSync(basePath, 0);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in current path with level 0', () => {
    // arranges
    const basePath = resolvePath('./test/_resources/loader');
    const expected = [
      './js.js',
      './json.json',
      './x.config',
      './y.config'
    ].map(each => path.join(basePath, each));

    // acts
    const result = allFilesSync(basePath, 0);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in specified path and level -1', () => {
    // arranges
    const basePath = resolvePath('./test/_resources');
    const expected = [
      './jsons/jsoninside.jsin',
      './loader/dir/config.js',
      './loader/dir/fname.service.js',
      './loader/dir/lname.service.js',
      './loader/dir/value.module.js',
      './loader/js.js',
      './loader/json.json',
      './loader/x.config',
      './loader/y.config'
    ].map(each => path.join(basePath, each));

    // acts
    const result = allFilesSync(basePath, -1);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in specified path and level 1', () => {
    // arranges
    const basePath = resolvePath('./test/_resources');
    const expected = [
      './jsons/jsoninside.jsin',
      './loader/js.js',
      './loader/json.json',
      './loader/x.config',
      './loader/y.config'
    ].map(each => path.join(basePath, each));

    // acts
    const result = allFilesSync(basePath, 1);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in specified path and level 2', () => {
    // arranges
    const basePath = resolvePath('./test/_resources');
    const expected = [
      './jsons/jsoninside.jsin',
      './loader/dir/config.js',
      './loader/dir/fname.service.js',
      './loader/dir/lname.service.js',
      './loader/dir/value.module.js',
      './loader/js.js',
      './loader/json.json',
      './loader/x.config',
      './loader/y.config'
    ].map(each => path.join(basePath, each));

    // acts
    const result = allFilesSync(basePath, 2);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in specified path and level fewer than -1', () => {
    // arranges
    const basePath = resolvePath('./test/_resources');
    const expected = [
      './jsons/jsoninside.jsin',
      './loader/dir/config.js',
      './loader/dir/fname.service.js',
      './loader/dir/lname.service.js',
      './loader/dir/value.module.js',
      './loader/js.js',
      './loader/json.json',
      './loader/x.config',
      './loader/y.config'
    ].map(each => path.join(basePath, each));

    // acts
    const result = allFilesSync(basePath, -2);

    // asserts
    expect(result).to.deep.equal(expected);
  });
});
