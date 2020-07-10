import { expect } from 'chai';

import { assignLogStubToTestContext } from '../src/utils-test';
import { HTMLDisplayVisitor, WordsCollection, WordsDisplayComponent } from '../src/combinations/iterator-visitor';

const wordsArr = ['First', 'Second', 'Third', 'Fourth'];
// const reversedWordsArr = [wordsArr[3], wordsArr[2], wordsArr[1], wordsArr[0]];

const addFour = (collection: WordsCollection) => {
  collection.addItem(wordsArr[0]);
  collection.addItem(wordsArr[1]);
  collection.addItem(wordsArr[2]);
  collection.addItem(wordsArr[3]);
};

describe('Iterator-Visitor Combination', function () {
  assignLogStubToTestContext();

  beforeEach(function () {
    this.words = new WordsCollection();
    addFour(this.words);
    this.component = new WordsDisplayComponent(this.words);
  });

  describe('WordsDisplayComponent', function () {
    it('Component.display returns empty string if nothing to display', function () {
      this.component.display();
      expect(this.logStub).to.have.been.calledWith(
        ''
      );
    });

    it('Component.display returns html string of words list', function () {
      this.component.accept(new HTMLDisplayVisitor());
      this.component.display();
      expect(this.logStub).to.have.been.calledWith(`<html><body><ul>
<li>${wordsArr[0]}</li>
<li>${wordsArr[1]}</li>
<li>${wordsArr[2]}</li>
<li>${wordsArr[3]}</li>
</ul></body></html>`
      );
    });
  });
});

