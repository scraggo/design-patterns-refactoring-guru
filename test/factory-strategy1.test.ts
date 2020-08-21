import { expect } from 'chai';

import { assignLogStubToTestContext, getArgsForCall } from '../src/utils-test';
import { main } from '../src/combinations/factory-strategy1';

describe('Factory-Strategy Combination 1', function () {
  assignLogStubToTestContext();

  // beforeEach(function () {
  //   this.words = new WordsCollection();
  //   addFour(this.words);
  //   this.component = new WordsDisplayComponent(this.words);
  // });

  describe('main', function () {
    it('logs all expected calls on main()', function () {
      const products = main();

      expect(products.length).to.equal(3);
      expect(products[0]).to.contain('ConcreteProduct1');
      expect(products[1]).to.contain('ConcreteProduct1');
      expect(products[2]).to.contain('ConcreteProduct2');

      expect(this.logStub).to.have.callCount(6);
      expect(getArgsForCall(this.logStub, 0)[0]).to.equal(
        'App: Launched with the ConcreteCreator1.'
      );
      expect(getArgsForCall(this.logStub, 1)[0]).to.equal(
        'endpoint A - external'
      );
      expect(getArgsForCall(this.logStub, 2)[0]).to.equal(
        'App: Launched with the ConcreteCreator1.'
      );
      expect(getArgsForCall(this.logStub, 3)[0]).to.equal(
        'endpoint B - internal'
      );
      expect(getArgsForCall(this.logStub, 4)[0]).to.equal(
        'App: Launched with the ConcreteCreator2.'
      );
      expect(getArgsForCall(this.logStub, 5)[0]).to.equal(
        'endpoint B - internal'
      );
    });
  });
});
