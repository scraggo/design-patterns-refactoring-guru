import { WordsCollection } from '../src/behavioral/iterator';
import { expect } from 'chai';
import sinon = require('sinon');

import * as utils from '../src/utils';

let words: WordsCollection;
let logStub: sinon.SinonStub;

const wordsArr = ['First', 'Second', 'Third', 'Fourth'];
const reversedWordsArr = [wordsArr[3], wordsArr[2], wordsArr[1], wordsArr[0]];

const addFour = (collection: WordsCollection) => {
  collection.addItem(wordsArr[0]);
  collection.addItem(wordsArr[1]);
  collection.addItem(wordsArr[2]);
  collection.addItem(wordsArr[3]);
};

describe('Iterator Pattern', () => {
  before(() => {
    logStub = sinon.stub(utils, 'log').returns(null);
  });

  beforeEach(() => {
    logStub.resetHistory();
    words = new WordsCollection();
  });

  after(() => {
    logStub.restore();
  });

  describe('Collection', () => {
    it('getItems() works after addItem()', () => {
      expect(words.getItems()).to.deep.equal([]);
      addFour(words);
      expect(words.getItems()).to.deep.equal(wordsArr);
    });

    it('getCount() works after addItems()', () => {
      expect(words.getCount()).to.equal(0);
      addFour(words);
      expect(words.getCount()).to.equal(4);
    });
  });

  describe('Iterator', () => {
    it('valid() is true before end of collection, false at end', () => {
      addFour(words);
      const iterator = words.getIterator();
      expect(iterator.valid()).to.be.true;

      const collection: boolean[] = [];
      while (iterator.valid()) {
        iterator.next();
        collection.push(iterator.valid());
      }

      expect(collection).to.deep.equal([true, true, true, false]);
    });

    it('valid() is true before end of collection, false at end for reverse iterator', () => {
      addFour(words);
      const reverseIterator = words.getReverseIterator();
      expect(reverseIterator.valid()).to.be.true;

      const collection: boolean[] = [];
      while (reverseIterator.valid()) {
        reverseIterator.next();
        collection.push(reverseIterator.valid());
      }

      expect(collection).to.deep.equal([true, true, true, false]);
    });

    it('iterates in insertion order', () => {
      const iterator = words.getIterator();

      let collection: string[] = [];
      while (iterator.valid()) {
        collection.push(iterator.next());
      }

      expect(collection.length).to.equal(0);

      addFour(words);

      collection = [];
      while (iterator.valid()) {
        collection.push(iterator.next());
      }

      expect(collection).to.deep.equal(wordsArr);
    });

    it('iterates in reverse order', () => {
      addFour(words);
      const reverseIterator = words.getReverseIterator();

      const collection: string[] = [];

      while (reverseIterator.valid()) {
        collection.push(reverseIterator.next());
      }

      expect(collection).to.deep.equal(reversedWordsArr);
    });

    it('gets current item when current() is called', () => {
      addFour(words);
      const iterator = words.getIterator();
      expect(iterator.current()).to.equal(wordsArr[0]);
      iterator.next();
      expect(iterator.current()).to.equal(wordsArr[1]);
      iterator.next();
      expect(iterator.current()).to.equal(wordsArr[2]);
      iterator.next();
      expect(iterator.current()).to.equal(wordsArr[3]);
    });

    it('gets key (index) when key() is called', () => {
      addFour(words);
      const iterator = words.getIterator();
      expect(iterator.key()).to.equal(0);
      iterator.next();
      expect(iterator.key()).to.equal(1);
      iterator.next();
      expect(iterator.key()).to.equal(2);
      iterator.next();
      expect(iterator.key()).to.equal(3);
    });

    it('rewind() moves position to beginning of collection', () => {
      addFour(words);
      const iterator = words.getIterator();

      // move to end of collection
      while (iterator.valid()) {
        iterator.next();
      }

      expect(iterator.valid()).to.be.false;

      iterator.rewind();

      expect(iterator.current()).to.equal(wordsArr[0]);
    });

    it('rewind() moves position to end of collection if reversed', () => {
      addFour(words);
      const reverseIterator = words.getReverseIterator();

      // move to beginning of collection
      while (reverseIterator.valid()) {
        reverseIterator.next();
      }

      expect(reverseIterator.valid()).to.be.false;

      reverseIterator.rewind();

      expect(reverseIterator.current()).to.equal(wordsArr[3]);
    });
  });
});
