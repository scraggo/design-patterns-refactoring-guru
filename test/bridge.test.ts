import { expect } from 'chai';

import { Abstraction, ConcreteImplementationA, ConcreteImplementationB, ExtendedAbstraction, Implementation } from '../src/structural/bridge';

let implementation: Implementation;
let abstraction: Abstraction;

const messages = {
  abstraction: 'Abstraction: Base operation with:\n',
  extendedAbstration: 'ExtendedAbstraction: Extended operation with:\n',
  concreteA: 'ConcreteImplementationA: Here\'s the result on the platform A.',
  concreteB: 'ConcreteImplementationB: Here\'s the result on the platform B.',
};

describe('Bridge Pattern', () => {
  describe('Abstraction with ConcreteImplementationA', function () {
    beforeEach(function () {
      implementation = new ConcreteImplementationA();
      abstraction = new Abstraction(implementation);
    });

    it('runs abstraction.operation()', function () {
      const result = abstraction.operation();
      expect(result).to.equal(messages.abstraction + messages.concreteA);
    });
  });

  describe('Abstraction with ConcreteImplementationB', function () {
    beforeEach(function () {
      implementation = new ConcreteImplementationB();
      abstraction = new Abstraction(implementation);
    });

    it('runs abstraction.operation()', function () {
      const result = abstraction.operation();
      expect(result).to.equal(messages.abstraction + messages.concreteB);
    });
  });

  describe('ExtendedAbstraction with ConcreteImplementationA', function () {
    beforeEach(function () {
      implementation = new ConcreteImplementationA();
      abstraction = new ExtendedAbstraction(implementation);
    });

    it('runs abstraction.operation()', function () {
      const result = abstraction.operation();
      expect(result).to.equal(messages.extendedAbstration + messages.concreteA);
    });
  });

  describe('ExtendedAbstraction with ConcreteImplementationB', function () {
    beforeEach(function () {
      implementation = new ConcreteImplementationB();
      abstraction = new ExtendedAbstraction(implementation);
    });

    it('runs abstraction.operation()', function () {
      const result = abstraction.operation();
      expect(result).to.equal(messages.extendedAbstration + messages.concreteB);
    });
  });
});
