import { expect } from 'chai';

import { ConcreteProduct1, ConcreteProduct2, Creator, getProductById } from '../src/creational/factory';

describe('Factory Method Pattern', function () {
  describe('getProductById', function () {
    it('gets result of id=a', function () {
      const result = getProductById('a');
      expect(result).to.include(Creator.creatorMessage);
      expect(result).to.include(ConcreteProduct1.resultString);
    });

    it('gets result of id=b', function () {
      const result = getProductById('b');
      expect(result).to.include(Creator.creatorMessage);
      expect(result).to.include(ConcreteProduct2.resultString);
    });

    it('throws if id not found', function () {
      const badFunc = () => getProductById('c');
      expect(badFunc).to.throw();
    });
  });
});
