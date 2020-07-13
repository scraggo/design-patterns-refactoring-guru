import { expect } from 'chai';

import {
  assignLogAndRandomStubToTestContext,
  getArgsForCall,
} from '../src/utils-test';
import {
  ConcreteObserverA,
  ConcreteObserverB,
  ConcreteSubject,
} from '../src/behavioral/observer';

export function main() {
  /**
   * The client code.
   */
  const subject = new ConcreteSubject();

  const observer1 = new ConcreteObserverA();
  subject.attach(observer1);

  const observer2 = new ConcreteObserverB();
  subject.attach(observer2);

  subject.someBusinessLogic();
  subject.someBusinessLogic();

  subject.detach(observer2);

  subject.someBusinessLogic();
}

describe('Observer', function () {
  assignLogAndRandomStubToTestContext();

  beforeEach(function () {
    this.subject = new ConcreteSubject();
    this.observerA = new ConcreteObserverA();
    this.observerB = new ConcreteObserverB();
  });

  describe('ConcreteSubject', function () {
    it('notify() calls no observers if none set', function () {
      this.subject.notify();
      expect(this.logStub).to.have.been.calledOnceWithExactly(
        'Subject: Notifying observers...'
      );
    });

    it('notify() calls one observer if attached', function () {
      this.subject.attach(this.observerA);
      this.subject.notify();
      expect(this.logStub).to.have.callCount(3);
      expect(getArgsForCall(this.logStub, 0)).to.deep.equal([
        'Subject: Attached an observer.',
      ]);
      expect(getArgsForCall(this.logStub, 1)).to.deep.equal([
        'Subject: Notifying observers...',
      ]);
      expect(getArgsForCall(this.logStub, 2)).to.deep.equal([
        'ConcreteObserverA: Reacted to the event.',
      ]);
    });

    it('notify() calls two observers if attached', function () {
      this.subject.attach(this.observerA);
      this.subject.attach(this.observerB);
      this.subject.notify();
      expect(this.logStub).to.have.callCount(5);
      expect(getArgsForCall(this.logStub, 0)).to.deep.equal([
        'Subject: Attached an observer.',
      ]);
      expect(getArgsForCall(this.logStub, 1)).to.deep.equal([
        'Subject: Attached an observer.',
      ]);
      expect(getArgsForCall(this.logStub, 2)).to.deep.equal([
        'Subject: Notifying observers...',
      ]);
      expect(getArgsForCall(this.logStub, 3)).to.deep.equal([
        'ConcreteObserverA: Reacted to the event.',
      ]);
      expect(getArgsForCall(this.logStub, 4)).to.deep.equal([
        'ConcreteObserverB: Reacted to the event.',
      ]);
    });

    it('Changes state and notifies on someBusinessLogic()', function () {
      this.subject.attach(this.observerA);
      this.subject.someBusinessLogic();
      expect(this.logStub).to.have.callCount(4);
      expect(this.logStub).to.have.been.calledWith(
        "\nSubject: I'm doing something important."
      );
      expect(this.logStub).to.have.been.calledWith(
        'Subject: My state has just changed to: 11'
      );
    });

    it('Detaches an observer', function () {
      this.subject.attach(this.observerA);
      this.subject.detach(this.observerA);
      expect(this.logStub).to.have.been.calledWith(
        'Subject: Detached an observer.'
      );
    });

    it('Logs a failure message if a non-attached observer is tried to detach', function () {
      this.subject.attach(this.observerA);
      this.subject.detach(this.observerB);
      expect(this.logStub).to.have.been.calledWith(
        'Subject: Nonexistent observer.'
      );
    });
  });
});
