import { ConcreteBuilder1, Director } from '../src/creational/builder';
import { expect } from 'chai';
import sinon = require('sinon');

let builder: ConcreteBuilder1;
let director: Director;
let consoleSpy: sinon.SinonSpy;

before(() => {
  consoleSpy = sinon.spy(console, 'log');
});

beforeEach(() => {
  consoleSpy.resetHistory();
  builder = new ConcreteBuilder1();
  director = new Director();
  director.setBuilder(builder);
});

after(() => {
  consoleSpy.restore();
});

describe('Builder', () => {
  it('builds standard MVP', () => {
    director.buildMinimalViableProduct();
    const product = builder.getProduct();

    expect(product).to.deep.equal({
      parts: ['PartA1'],
    });

    product.listParts();
    expect(consoleSpy).to.have.been.calledOnceWithExactly(
      'Product parts: PartA1\n'
    );
  });

  it('builds Standard full featured product', () => {
    director.buildFullFeaturedProduct();
    const product = builder.getProduct();

    expect(product).to.deep.equal({
      parts: ['PartA1', 'PartB1', 'PartC1'],
    });

    product.listParts();
    expect(consoleSpy).to.have.been.calledOnceWithExactly(
      'Product parts: PartA1, PartB1, PartC1\n'
    );
  });

  it('can be used without a Director class to build a custom project', () => {
    builder.producePartA();
    builder.producePartC();

    const product = builder.getProduct();

    expect(product).to.deep.equal({
      parts: ['PartA1', 'PartC1'],
    });

    product.listParts();
    expect(consoleSpy).to.have.been.calledOnceWithExactly(
      'Product parts: PartA1, PartC1\n'
    );
  });
});
