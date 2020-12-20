'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const mainModuleName = require('../../util/mainmodule.name').mainModuleName;

describe('#mainModule()', () => {
  let mainPackagepathStub;

  afterEach(() => {
    if (mainPackagepathStub) {
      mainPackagepathStub.restore();
      mainPackagepathStub = undefined;
    }
  });

  it('expect to get a name of the main module', () => {
    // arranges
    const expected = 'archappenv';

    // acts
    const result = mainModuleName();

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to get an undefined name of the main module', () => {
    // arranges
    const service = require('../../services/main.packagepath');
    mainPackagepathStub = sinon.stub(service, 'mainPackagepath').callsFake(() => undefined);

    // acts
    const result = mainModuleName();

    // asserts
    expect(service.mainPackagepath()).to.be.undefined;
    expect(result).to.be.undefined;
  });
});
