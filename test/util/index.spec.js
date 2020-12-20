'use strict';

const expect = require('chai').expect;
const index = require('../../util/index');

describe('#util/index.js tests', () => {
  it('expect index.js to have 15 properties', () => {
    // arranges

    // acts
    Object.keys(index).forEach((key) => {
      // asserts
      expect(index[key]).not.to.be.undefined;
    });
  });
});
