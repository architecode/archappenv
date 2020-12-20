'use strict';

const os = require('os');
const expect = require('chai').expect;
const hostname = require('../../services/hostname').hostname;

describe('#hostname()', () => {
  it('expect to get a hostname', () => {
    // arranges
    const expected = os.hostname();

    // acts
    const result = hostname();

    // asserts
    expect(result).to.not.be.undefined;
    expect(result).to.not.be.null;
    expect(result).to.equal(expected);
  });
});
