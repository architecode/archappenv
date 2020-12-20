'use strict';

const path = require('path');
const expect = require('chai').expect;
const subpathsSync = require('../../util/subpaths').subpathsSync;

describe('#subpathsSync()', () => {
  it('expect to get an array of paths associated to specified path', () => {
    // arranges
    const cwd = process.cwd();
    const ignores = [".git", ".nyc_output", "node_modules"];
    const subs = [
      '.',
      '_scripts',
      '_tsconfigs',
      '.circleci',
      'appenv',
      'services',
      'src',
      'src/appenv',
      'src/services',
      'src/util',
      'test',
      'test/_resources/',
      'test/_resources/jsons',
      'test/_resources/loader',
      'test/_resources/loader/dir',
      'test/appenv',
      'test/services',
      'test/util',
      'typings',
      'typings/appenv',
      'typings/services',
      'typings/util',
      'util',
    ];
    const expected = subs.map(each => path.join(path.resolve(each), path.sep));

    // acts
    const result = subpathsSync(cwd, ignores);

    // asserts
    const unmatched = result.filter(each => expected.indexOf(each) === -1);
    expect(unmatched).to.deep.equal([]);
    expect(result.length).to.equal(expected.length);
  });
});
