import { expect } from 'chai';
// import sinon = require('sinon');

import { getLogStub } from '../src/utils-test';

import { ConcreteBuilder1, Director } from '../src/creational/builder';

let builder: ConcreteBuilder1;
let director: Director;

describe('Builder Pattern', () => {
  before(function () {
    this.logStub = getLogStub();
  });

  beforeEach(function () {
    this.logStub.resetHistory();
    builder = new ConcreteBuilder1();
    director = new Director();
    director.setBuilder(builder);
  });

  after(function () {
    this.logStub.restore();
  });

  describe('without Director', function () {
    it('ConcreteBuilder1 calls reset() after getProduct()', function () {
      builder.producePartA();

      const product = builder.getProduct();

      expect(product).to.deep.equal({
        parts: ['PartA1'],
      });
      expect(builder.getProduct()).to.deep.equal({
        parts: [],
      });
    });

    it('can build a custom project', function () {
      builder.producePartA();
      builder.producePartC();

      const product = builder.getProduct();

      expect(product).to.deep.equal({
        parts: ['PartA1', 'PartC1'],
      });

      product.listParts();
      expect(this.logStub).to.have.been.calledOnceWithExactly(
        'Product parts: PartA1, PartC1\n'
      );
    });
  });

  describe('with Director', function () {
    it('builds Standard MVP', function () {
      director.buildMinimalViableProduct();
      const product = builder.getProduct();

      expect(product).to.deep.equal({
        parts: ['PartA1'],
      });

      product.listParts();
      expect(this.logStub).to.have.been.calledOnceWithExactly(
        'Product parts: PartA1\n'
      );
    });

    it('builds Standard full featured product', function () {
      director.buildFullFeaturedProduct();
      const product = builder.getProduct();

      expect(product).to.deep.equal({
        parts: ['PartA1', 'PartB1', 'PartC1'],
      });

      product.listParts();
      expect(this.logStub).to.have.been.calledOnceWithExactly(
        'Product parts: PartA1, PartB1, PartC1\n'
      );
    });
  });
});
