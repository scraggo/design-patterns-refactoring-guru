import {
  acceptVisitorForAll,
  ConcreteComponentA,
  ConcreteComponentB,
  ConcreteVisitor1,
  ConcreteVisitor2,
} from '../src/behavioral/visitor';
import { expect } from 'chai';
import sinon = require('sinon');

import * as utils from '../src/utils';

const getArgsForCall = (stub: sinon.SinonStub, call: number) =>
  stub.getCall(call).args;

const components = [new ConcreteComponentA(), new ConcreteComponentB()];

let logStub: sinon.SinonStub;

describe('Visitor', () => {
  before(() => {
    logStub = sinon.stub(utils, 'log').returns(null);
  });

  beforeEach(() => {
    logStub.resetHistory();
  });

  after(() => {
    logStub.restore();
  });

  it('acceptVisitorForAll() accepts visitor1 for both components', () => {
    const visitor1 = new ConcreteVisitor1();
    acceptVisitorForAll(components, visitor1);
    expect(logStub).to.have.been.calledTwice;
    expect(getArgsForCall(logStub, 0)).to.deep.equal(['A + ConcreteVisitor1']);
    expect(getArgsForCall(logStub, 1)).to.deep.equal(['B + ConcreteVisitor1']);
  });

  it('acceptVisitorForAll() accepts visitor2 for both components', () => {
    const visitor2 = new ConcreteVisitor2();
    acceptVisitorForAll(components, visitor2);
    expect(logStub).to.have.been.calledTwice;
    expect(getArgsForCall(logStub, 0)).to.deep.equal(['A + ConcreteVisitor2']);
    expect(getArgsForCall(logStub, 1)).to.deep.equal(['B + ConcreteVisitor2']);
  });
});
