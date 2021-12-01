'use strict';

const path = require('path');
const expect = require('chai').expect;
const packagePath = require('../../util/packagepath').packagePath;
const resolveFilePath = require('../../util/resolvefilepath').resolveFilePath;

describe('#resolveFilePath()', () => {
  it('expect to resolve a file path with "file" type, filepath, but "undefined" base', () => {
    // arranges
    const type1 = "file";
    const type2 = "FILE";
    const filepath = "./test.js";
    const expected = path.join(packagePath(), filepath);

    // acts
    const result1 = resolveFilePath(type1, filepath);
    const result2 = resolveFilePath(type2, filepath);

    // asserts
    expect(result1).to.equal(expected);
    expect(result2).to.equal(expected);
  });

  it('expect to resolve a file path with "file" type, "undefined" filepath, and "undefined" base', () => {
    // arranges
    const type = "file";
    const filepath = undefined;
    const expected = path.join(packagePath(), "index.js");

    // acts
    const result = resolveFilePath(type, filepath);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to resolve a file path with "file" type, and "absolute-path" base', () => {
    // arranges
    const type = "file";
    const filepath = "./test.js";
    const base = path.join(packagePath(), "./path/to");
    const absoluteFP = path.join(packagePath() + "path/to", filepath);
    const expected = absoluteFP;

    // acts
    const result1 = resolveFilePath(type, filepath, base);
    const result2 = resolveFilePath(type, absoluteFP);
    const result3 = resolveFilePath(type, absoluteFP, "./path/to/other");

    // asserts
    expect(result1).to.equal(expected);
    expect(result2).to.equal(expected);
    expect(result3).to.equal(expected);
  });

  it('expect to resolve a file path with "file" type, and "relative-path" base', () => {
    // arranges
    const type = "file";
    const filepath = "./test.js";
    const base = "./path/to";
    const expected = path.join(packagePath() + "path/to", filepath);

    // acts
    const result = resolveFilePath(type, filepath, base);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to resolve a file path with "file" type, "relative-path" base, but "undefined" filepath', () => {
    // arranges
    const type = "file";
    const filepath = undefined;
    const base = "./path/to";
    const expected = path.join(packagePath(), base, "index.js");

    // acts
    const result = resolveFilePath(type, filepath, base);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to resolve a file path with "module" type, "undefined" filepath and "undefined" base', () => {
    // arranges
    const type1 = "module";
    const type2 = "MODULE";
    const filepath = undefined;
    const pkgJSON = path.join(packagePath(), "package.json");
    const entryPoint = require(pkgJSON).main;
    const expected = path.join(packagePath(), entryPoint);

    // acts
    const result1 = resolveFilePath(type1, filepath);
    const result2 = resolveFilePath(type2, filepath);

    // asserts
    expect(result1).to.equal(expected);
    expect(result2).to.equal(expected);
  });

  it('expect to resolve a file path with "module" type, filepath, but "undefined" base', () => {
    // arranges
    const type = "module";
    const filepath = "./test.js";
    const absoluteFP = path.join(packagePath(), filepath);
    const expected = absoluteFP;

    // acts
    const result1 = resolveFilePath(type, filepath);
    const result2 = resolveFilePath(type, absoluteFP);

    // asserts
    expect(result1).to.equal(expected);
    expect(result2).to.equal(expected);
  });

  it('expect to resolve a file path with "module" type, base, but "undefined" filepath', () => {
    // arranges
    const type = "module";
    const filepath = undefined;
    const base = "test";
    const expected = "test";

    // acts
    const result = resolveFilePath(type, filepath, base);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to resolve a file path with "module" type, filepath, and base', () => {
    // arranges
    const type = "module";
    const filepath = "./test.js";
    const base = "module";
    const expected = path.join(packagePath(), "node_modules", base, filepath);

    // acts
    const result = resolveFilePath(type, filepath, base);

    // asserts
    expect(result).to.equal(expected);
  });

  it('expect to false as "unknown" type', () => {
    // arranges
    const type = "unknown";
    const filepath = "./test.js";
    const base = "module";
    const expected = undefined;

    // acts
    const result = resolveFilePath(type, filepath, base);

    // asserts
    expect(result).to.equal(expected);
  });
});
