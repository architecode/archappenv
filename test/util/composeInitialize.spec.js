'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const composeInitialize = require('../../util/composeInitialize').composeInitialize;

describe('#util/composeInitialize.js', () => {
  it('expect initialize() to be called', async () => {
    // arranges
    const initialize = sinon.stub().callsFake(() => Promise.resolve());

    // acts
    const initializer = composeInitialize(initialize);
    await initializer();

    // asserts
    expect(initialize.called).to.equal(true);
  });

  it('expect initialize() to be called only once', async () => {
    // arranges
    const initialize = sinon.stub().callsFake(() => Promise.resolve());

    // acts
    const initializer = composeInitialize(initialize);
    await initializer();
    await initializer();
    await initializer();

    // asserts
    expect(initialize.callCount).to.equal(1);
  });

  it('expect initialize() to be called and reject an error', async () => {
    // arranges
    const initialize = sinon.stub().callsFake(() => Promise.reject("EXPECTED_ERROR"));
    const initializer = composeInitialize(initialize);

    // acts
    try {
      await initializer();
    } catch (error) {
      // asserts
      expect(initialize.called).to.equal(true);
      expect(error).to.equal("EXPECTED_ERROR");
    }
  });

  it('expect initialize() to be called and throw an error', async () => {
    // arranges
    const initialize = sinon.stub().callsFake(() => {
      throw new Error("EXPECTED_ERROR");
    });
    const initializer = composeInitialize(initialize);

    // acts
    try {
      await initializer();
    } catch (error) {
      // asserts
      expect(initialize.called).to.equal(true);
      expect(error.message).to.equal("EXPECTED_ERROR");
    }
  });

  it('expect initialize() to be called any times if throw an error', async () => {
    // arranges
    const initialize = sinon.stub().callsFake(() => {
      throw new Error("EXPECTED_ERROR");
    });
    const initializer = composeInitialize(initialize);

    // acts
    try {
      await initializer();
    } catch {
      try {
        await initializer();
      } catch { }
    }

    // asserts
    expect(initialize.callCount).to.equal(2);
  });
});
