import { expect } from 'chai';

import { WordsCollection } from '../src/behavioral/iterator';

const wordsArr = ['First', 'Second', 'Third', 'Fourth'];
const reversedWordsArr = [wordsArr[3], wordsArr[2], wordsArr[1], wordsArr[0]];

const addFour = (collection: WordsCollection) => {
  collection.addItem(wordsArr[0]);
  collection.addItem(wordsArr[1]);
  collection.addItem(wordsArr[2]);
  collection.addItem(wordsArr[3]);
};

describe('Iterator Pattern', function () {
  beforeEach(function () {
    this.words = new WordsCollection();
  });

  describe('Collection', function () {
    it('getItems() works after addItem()', function () {
      expect(this.words.getItems()).to.deep.equal([]);
      addFour(this.words);
      expect(this.words.getItems()).to.deep.equal(wordsArr);
    });

    it('getCount() works after addItems()', function () {
      expect(this.words.getCount()).to.equal(0);
      addFour(this.words);
      expect(this.words.getCount()).to.equal(4);
    });
  });

  describe('Iterator', function () {
    it('valid() is true before end of collection, false at end', function () {
      addFour(this.words);
      const iterator = this.words.getIterator();

      const collection: boolean[] = [];
      while (iterator.valid()) {
        iterator.next();
        collection.push(iterator.valid());
      }

      expect(collection).to.deep.equal([true, true, true, false]);
    });

    it('valid() is true before end of collection, false at end for reverse iterator', function () {
      addFour(this.words);
      const reverseIterator = this.words.getReverseIterator();

      const collection: boolean[] = [];
      while (reverseIterator.valid()) {
        reverseIterator.next();
        collection.push(reverseIterator.valid());
      }

      expect(collection).to.deep.equal([true, true, true, false]);
    });

    it('iterates in insertion order', function () {
      const iterator = this.words.getIterator();

      let collection: string[] = [];
      while (iterator.valid()) {
        collection.push(iterator.next());
      }

      expect(collection.length).to.equal(0);

      addFour(this.words);

      collection = [];
      while (iterator.valid()) {
        collection.push(iterator.next());
      }

      expect(collection).to.deep.equal(wordsArr);
    });

    it('iterates in reverse order', function () {
      addFour(this.words);
      const reverseIterator = this.words.getReverseIterator();

      const collection: string[] = [];

      while (reverseIterator.valid()) {
        collection.push(reverseIterator.next());
      }

      expect(collection).to.deep.equal(reversedWordsArr);
    });

    it('gets current item when current() is called', function () {
      addFour(this.words);
      const iterator = this.words.getIterator();
      expect(iterator.current()).to.equal(wordsArr[0]);
      iterator.next();
      expect(iterator.current()).to.equal(wordsArr[1]);
      iterator.next();
      expect(iterator.current()).to.equal(wordsArr[2]);
      iterator.next();
      expect(iterator.current()).to.equal(wordsArr[3]);
    });

    it('gets key (index) when key() is called', function () {
      addFour(this.words);
      const iterator = this.words.getIterator();
      expect(iterator.key()).to.equal(0);
      iterator.next();
      expect(iterator.key()).to.equal(1);
      iterator.next();
      expect(iterator.key()).to.equal(2);
      iterator.next();
      expect(iterator.key()).to.equal(3);
    });

    it('rewind() moves position to beginning of collection', function () {
      addFour(this.words);
      const iterator = this.words.getIterator();

      // move to end of collection
      while (iterator.valid()) {
        iterator.next();
      }

      expect(iterator.valid()).to.be.false;

      iterator.rewind();

      expect(iterator.current()).to.equal(wordsArr[0]);
    });

    it('rewind() moves position to end of collection if reversed', function () {
      addFour(this.words);
      const reverseIterator = this.words.getReverseIterator();

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
