'use strict';

const path = require("path");
const expect = require('chai').expect;
const packagePath = require('../../util/packagepath').packagePath;
const modulePath = require('../../util/modulepath').modulePath;

describe('#modulePath()', () => {
  it('expect to get a path of current module when module name is not provided', () => {
    // arranges
    const expected = packagePath();

    // acts
    const result = modulePath();

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to get a path of module when module name is provided', () => {
    // arranges
    const pkgpath = packagePath();
    const module1 = "chai";
    const module2 = "sinon";
    const module3 = "archappenv";
    const expected1 = path.join(pkgpath, "node_modules", module1, path.sep);
    const expected2 = path.join(pkgpath, "node_modules", module2, path.sep);
    const expected3 = pkgpath;

    // acts
    const result1 = modulePath(module1);
    const result2 = modulePath(module2);
    const result3 = modulePath(module3);

    // asserts
    expect(result1).to.equal(expected1);
    expect(result2).to.equal(expected2);
    expect(result3).to.equal(expected3);
  });

  it("expect to throw an exception when the module isn't there", () => {
    // arranges
    const module = "nonexistmodule";

    // acts
    const act = () => modulePath(module);

    // asserts
    expect(act).to.throw(Error);
  });
});
