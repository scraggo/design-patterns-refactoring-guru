import { expect } from 'chai';

// import { assignLogStubToTestContext } from '../src/utils-test';
import { main } from '../src/combinations/flyweight-memento';

describe.only('Flyweight-memento Combination', function () {
  // assignLogStubToTestContext();

  // beforeEach(function () {
  //   this.words = new WordsCollection();
  //   addFour(this.words);
  //   this.component = new WordsDisplayComponent(this.words);
  // });

  describe('main', function () {
    it('logs all expected calls on main()', function () {
      const res = main();
      expect(res).to.be.undefined;
    });
  });
});
