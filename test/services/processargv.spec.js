'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const { processArgv, UTIL } = require('../../services/processargv');
const argv = process.argv;

describe('#processargv.js', () => {
  describe('#UTIL', () => {
    describe('#UTIL.trim()', () => {
      it('expect to trim a value', () => {
        // arranges

        // acts
        const result1 = UTIL.trim('-a');
        const result2 = UTIL.trim('--b');
        const result3 = UTIL.trim('---c');

        // asserts
        expect(result1).to.equal('a');
        expect(result2).to.equal('b');
        expect(result3).to.equal('c');
      });

      it('expect not to mutate an argument', () => {
        // arranges
        const arg = { value: '--value' };

        // acts
        const result = UTIL.trim(arg.value);

        // asserts
        expect(result).to.equal('value');
        expect(arg.value).to.equal('--value');
      });
    });

    describe('#UTIL.processArgv()', () => {
      after(() => process.argv = argv);

      it('expect to get the empty value (array of one underscore) from process.argv ', () => {
        // arranges
        process.argv = ['/nodejs/node.exe', '/execute/directory'];
        const expected = [['_']];

        // acts
        const result = UTIL.processArgv();

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it('expect to get the value from process.argv', () => {
        // arranges
        process.argv = ['/nodejs/node.exe', '/execute/directory', '-a', 'b', '-c', 'd', 'e'];
        const expected = [['_'], ['-a', 'b'], ['-c', 'd', 'e']];

        // acts
        const result = UTIL.processArgv();

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it('expect to get the value from process.argv with root and flag-typed', () => {
        // arranges
        process.argv = ['/nodejs/node.exe', '/execute/directory', 'a', 'b', '-c', 'd', '-', '--e', 'f', 'g', '-h', 'i', '-j'];
        const expected = [['_', 'a', 'b'], ['-c', 'd', '-'], ['--e', 'f', 'g'], ['-h', 'i'], ['-j']];

        // acts
        const result = UTIL.processArgv();

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it('expect to get the value from process.argv with root and argument-typed', () => {
        // arranges
        process.argv = ['/nodejs/node.exe', '/execute/directory', 'a', 'b', '-c', 'd', '--e', 'f', 'g', '-hij', 'k', 'l', '-mn', 'o', 'p', 'q', 'r'];
        const expected = [['_', 'a', 'b'], ['-c', 'd'], ['--e', 'f', 'g'], ['-hij', 'k', 'l'], ['-mn', 'o', 'p', 'q', 'r']];

        // acts
        const result = UTIL.processArgv();

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe('#UTIL.mapProcessArgv()', () => {
      it('expect to map the process.argv', () => {
        // arranges
        const argv = [['_', 'a', 'b'], ['-c', 'd'], ['--e', 'f', 'g'], ['-h', 'i'], ['-j']];
        const expected = [
          { key: '_', value: ['a', 'b'] },
          { key: 'c', value: 'd' },
          { key: 'e', value: ['f', 'g'] },
          { key: 'h', value: 'i' },
          { key: 'j', value: undefined }
        ];

        // acts
        const result = UTIL.mapProcessArgv(argv);

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it('expect to map the process.argv with flag-typed', () => {
        // arranges
        const argv = [['_', 'a', 'b'], ['--c', 'd'], ['--e'], ['-hij', 'k', 'l'], ['-mn', 'o', 'p', 'q', 'r']];
        const expected = [
          { key: '_', value: ['a', 'b'] },
          { key: 'c', value: 'd' },
          { key: 'e', value: undefined },
          { key: 'h', value: 'k' },
          { key: 'i', value: 'l' },
          { key: 'j', value: undefined },
          { key: 'm', value: 'o' },
          { key: 'n', value: ['p', 'q', 'r'] }
        ];

        // acts
        const result = UTIL.mapProcessArgv(argv);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe('#UTIL.filterArgv()', () => {
      it('expect to filter the process.argv', () => {
        // arranges
        const argv = [
          { key: '_', value: ['a', 'b'] },
          { key: 'c', value: 'd' },
          { key: 'e', value: ['f', 'g'] },
          { key: 'h', value: 'i' },
          { key: 'j', value: undefined }
        ];
        const expected = [];

        // acts
        const result = UTIL.filterArgv(argv, []);

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it('expect to filter the process.argv', () => {
        // arranges
        const argv = [
          { key: '_', value: ['a', 'b'] },
          { key: 'c', value: 'd' },
          { key: 'e', value: ['f', 'g'] },
          { key: 'h', value: 'k' },
          { key: 'i', value: 'l' },
          { key: 'j', value: undefined },
          { key: 'm', value: 'o' },
          { key: 'n', value: ['p', 'q', 'r'] }
        ];
        const filter = ['c', 'e', 'i', 'n'];
        const expected = [
          { key: 'c', value: 'd' },
          { key: 'e', value: ['f', 'g'] },
          { key: 'i', value: 'l' },
          { key: 'n', value: ['p', 'q', 'r'] }
        ];

        // acts
        const result = UTIL.filterArgv(argv, filter);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe('#UTIL.reduceArgv()', () => {
      it('expect to reduce the process.argv', () => {
        // arranges
        const argv = [
          { key: '_', value: ['a', 'b'] },
          { key: 'c', value: 'd' },
          { key: 'e', value: ['f', 'g'] },
          { key: 'h', value: 'i' },
          { key: 'j', value: undefined }
        ];
        const expected = {
          _: ['a', 'b'],
          c: 'd',
          e: ['f', 'g'],
          h: 'i',
          j: undefined
        };

        // acts
        const result = UTIL.reduceArgv(argv);

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it('expect to reduce the process.argv with flag-typed', () => {
        // arranges
        const argv = [
          { key: '_', value: ['a', 'b'] },
          { key: 'c', value: 'd' },
          { key: 'e', value: ['f', 'g'] },
          { key: 'h', value: 'k' },
          { key: 'i', value: 'l' },
          { key: 'j', value: undefined },
          { key: 'm', value: 'o' },
          { key: 'n', value: ['p', 'q', 'r'] }
        ];
        const expected = {
          _: ['a', 'b'],
          c: 'd',
          e: ['f', 'g'],
          h: 'k',
          i: 'l',
          j: undefined,
          m: 'o',
          n: ['p', 'q', 'r']
        };

        // acts
        const result = UTIL.reduceArgv(argv);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe('#processArgv()', () => {
    let processArgvSpy, mapProcessArgvSpy, filterArgvSpy, reduceArgvSpy;

    before(() => {
      processArgvSpy = sinon.spy(UTIL, "processArgv");
      mapProcessArgvSpy = sinon.spy(UTIL, "mapProcessArgv");
      filterArgvSpy = sinon.spy(UTIL, "filterArgv");
      reduceArgvSpy = sinon.spy(UTIL, "reduceArgv");

      processArgvSpy.resetHistory
    });

    after(() => {
      processArgvSpy.restore();
      mapProcessArgvSpy.restore();
      filterArgvSpy.restore();
      reduceArgvSpy.restore();
      process.argv = argv;
    });

    afterEach(() => {
      processArgvSpy.resetHistory();
      mapProcessArgvSpy.resetHistory();
      filterArgvSpy.resetHistory();
      reduceArgvSpy.resetHistory();
    });

    it('expect to get an empty object when no arguments are provided', () => {
      // arranges
      process.argv = ['/nodejs/node.exe', '/execute/directory'];
      const expected = { _: [] };

      // acts
      const result = processArgv();

      // asserts
      expect(result).to.deep.equal(expected);
      expect(processArgvSpy.called).to.be.true;
      expect(mapProcessArgvSpy.called).to.be.true;
      expect(filterArgvSpy.called).to.be.false;
      expect(reduceArgvSpy.called).to.be.true;
    });

    it('expect to get an object when arguments are provided', () => {
      // arranges
      process.argv = ['/nodejs/node.exe', '/execute/directory', 'a', 'b', '-c', 'd', '--extra', 'f', 'g'];
      const expected = {
        _: ['a', 'b'],
        c: 'd',
        extra: ['f', 'g']
      };

      // acts
      const result = processArgv();

      // asserts
      expect(result).to.deep.equal(expected);
      expect(processArgvSpy.called).to.be.true;
      expect(mapProcessArgvSpy.called).to.be.true;
      expect(filterArgvSpy.called).to.be.false;
      expect(reduceArgvSpy.called).to.be.true;
    });

    it('expect to get an object when arguments are provided with filter', () => {
      // arranges
      process.argv = ['/nodejs/node.exe', '/execute/directory', 'a', 'b', '-c', 'd', '--extra', 'f', 'g', '-h', 'i'];
      const expected = {
        c: 'd',
      };

      // acts
      const result = processArgv('c');

      // asserts
      expect(result).to.deep.equal(expected);
      expect(processArgvSpy.called).to.be.true;
      expect(mapProcessArgvSpy.called).to.be.true;
      expect(filterArgvSpy.called).to.be.true;
      expect(reduceArgvSpy.called).to.be.true;
    });

    it('expect to get an object when arguments are provided with array of filters', () => {
      // arranges
      process.argv = ['/nodejs/node.exe', '/execute/directory', 'a', 'b', '-c', 'd', '--extra', 'f', 'g', '-h', 'i'];
      const expected = {
        extra: ['f', 'g'],
        h: 'i'
      };

      // acts
      const result = processArgv(['h', 'extra']);

      // asserts
      expect(result).to.deep.equal(expected);
      expect(processArgvSpy.called).to.be.true;
      expect(mapProcessArgvSpy.called).to.be.true;
      expect(filterArgvSpy.called).to.be.true;
      expect(reduceArgvSpy.called).to.be.true;
    });

    it('expect to get an exception when an invalid argument is provided', () => {
      // arranges
      process.argv = ['/nodejs/node.exe', '/execute/directory', 'a', 'b', '-c', 'd', '--extra', 'f', 'g', '-h', 'i'];

      // acts
      const act = () => processArgv({});

      // asserts
      expect(act).to.throw(Error);
    });
  });
});
