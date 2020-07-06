import { expect } from 'chai';
// import sinon = require('sinon');

import { getArgsForCall, getLogStub } from '../src/utils-test';

import {
  acceptVisitorForAll,
  ConcreteComponentA,
  ConcreteComponentB,
  ConcreteVisitor1,
  ConcreteVisitor2,
} from '../src/behavioral/visitor';

const components = [new ConcreteComponentA(), new ConcreteComponentB()];

describe('Visitor Pattern', () => {
  before(function () {
    this.logStub = getLogStub();
  });

  beforeEach(function () {
    this.logStub.resetHistory();
  });

  after(function () {
    this.logStub.restore();
  });

  it('acceptVisitorForAll() accepts visitor1 for both components', function () {
    const visitor1 = new ConcreteVisitor1();
    acceptVisitorForAll(components, visitor1);
    expect(this.logStub).to.have.been.calledTwice;
    expect(getArgsForCall(this.logStub, 0)).to.deep.equal([
      'A + ConcreteVisitor1',
    ]);
    expect(getArgsForCall(this.logStub, 1)).to.deep.equal([
      'B + ConcreteVisitor1',
    ]);
  });

  it('acceptVisitorForAll() accepts visitor2 for both components', function () {
    const visitor2 = new ConcreteVisitor2();
    acceptVisitorForAll(components, visitor2);
    expect(this.logStub).to.have.been.calledTwice;
    expect(getArgsForCall(this.logStub, 0)).to.deep.equal([
      'A + ConcreteVisitor2',
    ]);
    expect(getArgsForCall(this.logStub, 1)).to.deep.equal([
      'B + ConcreteVisitor2',
    ]);
  });
});
