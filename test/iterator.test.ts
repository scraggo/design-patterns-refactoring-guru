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

describe('Iterator', () => {
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
});
