'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const packagepath = require('../../services/packagepath').packagepath;
const packagePath = require('../../util/packagepath').packagePath;
const reset = require('../../util/packagepath').reset;

describe('#packagePath()', () => {
  let packagepathStub;

  afterEach(() => {
    if (packagepathStub) {
      packagepathStub.restore();
      packagepathStub = undefined;
    }
  });

  it('expect to get an empty string as package path resolved as undefined', () => {
    // arranges
    reset();
    const service = require('../../services/packagepath');
    packagepathStub = sinon.stub(service, 'packagepath').callsFake(() => undefined);

    // acts
    const result = packagePath();

    // asserts
    expect(service.packagepath()).to.be.undefined;
    expect(result).not.to.be.undefined;
    expect(result).to.equal('');
  });

  it('expect to get the package path as singleton', () => {
    // arranges
    const expected = packagepath();

    // acts
    const act = packagePath();

    // asserts
    const assert = packagePath();
    expect(act).to.equal(assert);
    expect(act).to.equal(expected);
  });
});
