'use strict';

const path = require("path");
const fs = require("fs");
const expect = require('chai').expect;
const packagePath = require('../../util/packagepath').packagePath;
const packageJSON = require('../../util/packagejson').packageJSON;

describe('#packageJSON()', () => {
  it('expect to get the path of package.json', () => {
    // arranges
    const pkgpath = packagePath();
    const expected = path.join(pkgpath, "package.json");

    // acts
    const result = packageJSON();

    // asserts
    expect(result).to.equal(expected);
    expect(fs.existsSync(result)).to.be.true;
  });
});
