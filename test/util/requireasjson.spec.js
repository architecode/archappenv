'use strict';

const path = require('path');
const expect = require('chai').expect;
const packagePath = require('../../util/packagepath').packagePath;
const requireAsJSON = require('../../util/requireasjson').requireAsJSON;

describe('#requireAsJSON()', () => {
  const jsin = { name: 'JSonINside', type: 'jsin' };

  it('expect to read a file and get JSON as output when only the relative file is provided', () => {
    // arranges
    const file = './test/_resources/jsons/jsoninside.jsin';

    // acts
    const result = requireAsJSON(file);

    // asserts
    expect(result).to.deep.equal(jsin);
  });

  it('expect to read a file and get JSON as output when only the absolute file is provided', () => {
    // arranges
    const file = path.join(packagePath(), './test/_resources/jsons/jsoninside.jsin');

    // acts
    const result = requireAsJSON(file);

    // asserts
    expect(result).to.deep.equal(jsin);
  });

  it('expect to read a file and get JSON as output when both file and relative path are provided', () => {
    // arranges

    // acts
    const result1 = requireAsJSON('jsoninside.jsin', './test/_resources/jsons');
    const result2 = requireAsJSON('../jsons/jsoninside.jsin', './test/_resources/jsons');

    // asserts
    expect(result1).to.deep.equal(jsin);
    expect(result2).to.deep.equal(jsin);
  });

  it('expect to read a file and get JSON as output when both file and absolute path are provided', () => {
    // arranges
    const file = 'jsoninside.jsin';
    const abspath = path.join(packagePath(), './test/_resources/jsons');

    // acts
    const result = requireAsJSON(file, abspath);

    // asserts
    expect(result).to.deep.equal(jsin);
  });
});
