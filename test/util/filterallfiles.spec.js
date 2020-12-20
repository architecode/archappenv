'use strict';

const path = require('path');
const expect = require('chai').expect;
const resolvePath = require('../../util/resolvepath').resolvePath;
const filterAllFilesSync = require('../../util/filterallfiles').filterAllFilesSync;

describe('#util/filterallfiles.js', () => {
  it('expect to get an array of all files in specified path with always-true filter and default level', () => {
    // arranges
    const filter = () => true;
    const baseFile = resolvePath('./test/_resources');
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
    ].map(each => path.join(baseFile, each));

    // acts
    const result = filterAllFilesSync(filter, baseFile);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an empty array with undefined filter and default level', () => {
    // arranges
    const baseFile = resolvePath('./test/_resources');
    const expected = [];

    // acts
    const result = filterAllFilesSync(undefined, baseFile);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of files in specified path with filter and default level', () => {
    // arranges
    const filter = (val) => path.extname(val) === ".js";
    const baseFile = resolvePath('./test/_resources');
    const expected = [
      './loader/dir/config.js',
      './loader/dir/fname.service.js',
      './loader/dir/lname.service.js',
      './loader/dir/value.module.js',
      './loader/js.js'
    ].map(each => path.join(baseFile, each));

    // acts
    const result = filterAllFilesSync(filter, baseFile);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in current path with always-true filter and level 0', () => {
    // arranges
    const filter = () => true;
    const baseFile = resolvePath('./test/_resources/loader');
    const expected = [
      './js.js',
      './json.json',
      './x.config',
      './y.config'
    ].map(each => path.join(baseFile, each));

    // acts
    const result = filterAllFilesSync(filter, baseFile, 0);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in specified path with always-true filter and level -1', () => {
    // arranges
    const filter = () => true;
    const baseFile = resolvePath('./test/_resources');
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
    ].map(each => path.join(baseFile, each));

    // acts
    const result = filterAllFilesSync(filter, baseFile, -1);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in specified path with always-true filter and level 1', () => {
    // arranges
    const filter = () => true;
    const baseFile = resolvePath('./test/_resources');
    const expected = [
      './jsons/jsoninside.jsin',
      './loader/js.js',
      './loader/json.json',
      './loader/x.config',
      './loader/y.config'
    ].map(each => path.join(baseFile, each));

    // acts
    const result = filterAllFilesSync(filter, baseFile, 1);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in specified path with always-true filter and level 2', () => {
    // arranges
    const filter = () => true;
    const baseFile = resolvePath('./test/_resources');
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
    ].map(each => path.join(baseFile, each));

    // acts
    const result = filterAllFilesSync(filter, baseFile, 2);

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to get an array of all files in specified path with always-true filter and level fewer than -1', () => {
    // arranges
    const filter = () => true;
    const baseFile = resolvePath('./test/_resources');
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
    ].map(each => path.join(baseFile, each));

    // acts
    const result = filterAllFilesSync(filter, baseFile, -2);

    // asserts
    expect(result).to.deep.equal(expected);
  });
});
