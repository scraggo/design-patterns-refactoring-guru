import { expect } from 'chai';
// import sinon = require('sinon');

import { assignLogStubToTestContext } from '../src/utils-test';

import { CompanyLevel, createCompany, NotificationSystem } from '../src/combinations/composite-observer';

let notifications: NotificationSystem;
let company: any;

describe('Composite Observer combination', () => {
  assignLogStubToTestContext();

  beforeEach(function () {
    notifications = new NotificationSystem();
    company = createCompany();
    notifications.attach(company);
  });

  describe('boss calls', function () {
    it('calls boss', function () {
      notifications.someBusinessLogic(CompanyLevel.boss);
      // expect(this.logStub).to.have.been.calledOnceWithExactly(
      //   'Event: boss - Data: boss_message'
      // );
    });
  });
});
