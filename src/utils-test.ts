import sinon = require('sinon');

import * as utils from './utils';

export const getArgsForCall = (stub: sinon.SinonStub, call: number): any[] =>
  stub.getCall(call).args;

export const getMathRandomStub = (): sinon.SinonStub =>
  sinon.stub(Math, 'random').returns(1);

export const getLogStub = (): sinon.SinonStub =>
  sinon.stub(utils, 'log').returns(null);

interface StubObj {
  name: string;
  getStub: Function;
}

const logStubObj = { getStub: getLogStub, name: 'logStub' };
const mathRandomStubObj = {
  getStub: getMathRandomStub,
  name: 'mathRandomStub',
};

export const assignStubsToTestContext = (stubs: StubObj[]) => {
  before(function () {
    stubs.forEach((stub) => {
      this[stub.name] = stub.getStub();
    });
  });

  beforeEach(function () {
    stubs.forEach((stub) => {
      this[stub.name].resetHistory();
    });
  });

  after(function () {
    stubs.forEach((stub) => {
      this[stub.name].restore();
    });
  });
};

export const assignLogStubToTestContext = (): void =>
  assignStubsToTestContext([logStubObj]);

export const assignLogAndRandomStubToTestContext = (): void =>
  assignStubsToTestContext([logStubObj, mathRandomStubObj]);
