import { log } from '../utils';

/**
 * The Product interface declares the operations that all concrete products must
 * implement.
 */
interface Product {
  operation(): string;
}

/**
 * Concrete Products provide various implementations of the Product interface.
 */
class ConcreteProduct1 implements Product {
  public operation(): string {
    return '{Result of the ConcreteProduct1}';
  }
}

class ConcreteProduct2 implements Product {
  public operation(): string {
    return '{Result of the ConcreteProduct2}';
  }
}

/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm.
 *
 * The Context uses this interface to call the algorithm defined by Concrete
 * Strategies.
 */
interface Strategy {
  doAlgorithm(data: string[]): void;
  getProduct(): Product;
}

/**
 * Concrete Strategies implement the algorithm while following the base Strategy
 * interface. The interface makes them interchangeable in the Context.
 */
export class EndpointStrategyA1 implements Strategy {
  public data = 0;

  public doAlgorithm(data: string[]): void {
    log('endpoint A - external', data);
    // munge the data...
    this.data = data.length;
  }

  public getProduct() {
    // use the data...
    return new ConcreteProduct1();
  }
}

export class EndpointStrategyB1 implements Strategy {
  public data = 0;

  public doAlgorithm(data: string[]): void {
    log('endpoint B - internal', data);
    // munge the data...
    this.data = data.length * 2;
  }

  public getProduct() {
    // use the data...
    return new ConcreteProduct1();
  }
}

export class EndpointStrategyA2 implements Strategy {
  public data = 0;

  public doAlgorithm(data: string[]): void {
    log('endpoint B - internal', data);
    // munge the data...
    this.data = data.length;
  }

  public getProduct() {
    // use the data...
    return new ConcreteProduct2();
  }
}

/**
 * The Creator class declares the factory method that is supposed to return an
 * object of a Product class. The Creator's subclasses usually provide the
 * implementation of this method.
 */
abstract class Creator {
  public strategy!: Strategy;

  constructor(strategy: Strategy) {
    this.setStrategy(strategy);
  }

  /*
   * Usually, the Context allows replacing a Strategy object at runtime.
   */
  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  /**
   * Note that the Creator may also provide some default implementation of the
   * factory method.
   */
  public abstract factoryMethod(config: string[]): Product;

  /*
   * Also note that, despite its name, the Creator's primary responsibility is
   * not creating products. Usually, it contains some core business logic that
   * relies on Product objects, returned by the factory method. Subclasses can
   * indirectly change that business logic by overriding the factory method
   * and returning a different type of product from it.
   */
  public someOperation(config: string[]): string {
    // Call the factory method to create a Product object.
    const product = this.factoryMethod(config);
    // Now, use the product.
    return `Creator: The same creator's code has just worked with ${product.operation()}`;
  }
}

/**
 * Concrete Creators override the factory method in order to change the
 * resulting product's type.
 */
export class ConcreteCreator1 extends Creator {
  /*
   * Note that the signature of the method still uses the abstract product
   * type, even though the concrete product is actually returned from the
   * method. This way the Creator can stay independent of concrete product
   * classes.
   */
  public factoryMethod(config: string[]): Product {
    this.strategy.doAlgorithm(config);
    return this.strategy.getProduct();
  }
}

export class ConcreteCreator2 extends Creator {
  public factoryMethod(config: string[]): Product {
    this.strategy.doAlgorithm(config);
    return this.strategy.getProduct();
  }
}

/*
 * The client code works with an instance of a concrete creator, albeit through
 * its base interface. As long as the client keeps working with the creator via
 * the base interface, you can pass it any creator's subclass.
 */
export function clientCode(creator: Creator, data: string[]) {
  // ...
  // log("Client: I'm not aware of the creator's class, but it still works.");
  return creator.someOperation(data);
  // ...
}

export function main() {
  /*
   * The Application picks a creator's type depending on the configuration or
   * environment.
   */
  const products = [];

  log('App: Launched with the ConcreteCreator1.');

  products.push(
    clientCode(new ConcreteCreator1(new EndpointStrategyA1()), [''])
  );

  log('App: Launched with the ConcreteCreator1.');

  products.push(
    clientCode(new ConcreteCreator1(new EndpointStrategyB1()), ['', ''])
  );

  log('App: Launched with the ConcreteCreator2.');

  products.push(
    clientCode(new ConcreteCreator2(new EndpointStrategyA2()), [''])
  );

  return products;
}

export const name = 'Factory-Strategy1';
