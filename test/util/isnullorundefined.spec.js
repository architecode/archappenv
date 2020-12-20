'use strict';

const expect = require('chai').expect;
const isNullOrUndefined = require('../../util/isnullorundefined').isNullOrUndefined;

describe('#util/isnullorundefined.js', () => {
  it('expect false when value is false', () => {
    // arranges

    // acts
    const result = isNullOrUndefined(false);

    // asserts
    expect(result).to.equal(false);
  });

  it('expect false when value is 0', () => {
    // arranges

    // acts
    const result = isNullOrUndefined(0);

    // asserts
    expect(result).to.equal(false);
  });

  it('expect true when value is null', () => {
    // arranges

    // acts
    const result = isNullOrUndefined(null);

    // asserts
    expect(result).to.equal(true);
  });

  it('expect true when value is undefined', () => {
    // arranges

    // acts
    const result = isNullOrUndefined(undefined);

    // asserts
    expect(result).to.equal(true);
  });
});
