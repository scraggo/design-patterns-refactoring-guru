import sinon = require('sinon');

import * as utils from './utils';

export const getArgsForCall = (stub: sinon.SinonStub, call: number): any[] =>
  stub.getCall(call).args;

export const getLogStub = (): sinon.SinonStub =>
  sinon.stub(utils, 'log').returns(null);
