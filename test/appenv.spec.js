'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs');
const mock_require = require('mock-require');
const { resolveFile } = require('../util');
const AppEnv = require('../appenv');

describe('#appenv.js', () => {
  let existsSyncStub;
  const defaultAppEnvFile = resolveFile('./appenv/default.appenv.js');

  before(() => {
    const defaultAppEnv = { test: "value" };
    existsSyncStub = sinon.stub(fs, 'existsSync');
    existsSyncStub.callsFake(v => [defaultAppEnvFile].indexOf(v) > -1);
    mock_require(defaultAppEnvFile, defaultAppEnv);
  });

  after(() => {
    existsSyncStub.restore();
    mock_require.stopAll();
  });

  it('expect to load the appenv', () => {
    // arranges
    const expected = { test: 'value' };

    // acts
    const result = AppEnv.load();

    // asserts
    expect(result).to.deep.equal(expected);
  });

  it('expect to bind the appenv to process.env', () => {
    // arranges
    const expected = { test: 'value' };

    // acts
    const result = AppEnv.bind();
    const testValue = process.env.test;

    // asserts
    expect(result).to.deep.equal(expected);
    expect(testValue).to.equal(expected.test);
  });
});
