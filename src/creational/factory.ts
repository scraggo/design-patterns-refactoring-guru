/*
 * The Product interface declares the operations that all concrete products must
 * implement.
 */
interface Product {
  operation(): string;
}

/*
 * Concrete Products provide various implementations of the Product interface.
 */
export class ConcreteProduct1 implements Product {
  static resultString = '{Result of the ConcreteProduct1}';
  public operation(): string {
    return ConcreteProduct1.resultString;
  }
}

export class ConcreteProduct2 implements Product {
  static resultString = '{Result of the ConcreteProduct2}';
  public operation(): string {
    return ConcreteProduct2.resultString;
  }
}

/**
 * The Creator class declares the factory method that is supposed to return an
 * object of a Product class. The Creator's subclasses usually provide the
 * implementation of this method.
 */
export abstract class Creator {
  static creatorMessage = "Creator: The same creator's code has just worked with";

  /**
   * Note that the Creator may also provide some default implementation of the
   * factory method.
   */
  public abstract factoryMethod(): Product;

  /*
   * Also note that, despite its name, the Creator's primary responsibility is
   * not creating products. Usually, it contains some core business logic that
   * relies on Product objects, returned by the factory method. Subclasses can
   * indirectly change that business logic by overriding the factory method
   * and returning a different type of product from it.
   */
  public someOperation(): string {
    // Call the factory method to create a Product object.
    const product = this.factoryMethod();
    // Now, use the product.
    return `${Creator.creatorMessage} ${product.operation()}`;
  }
}

/**
 * Concrete Creators override the factory method in order to change the
 * resulting product's type.
 */
class ConcreteCreator1 extends Creator {
  /**
   * Note that the signature of the method still uses the abstract product
   * type, even though the concrete product is actually returned from the
   * method. This way the Creator can stay independent of concrete product
   * classes.
   * @returns {Product} ConcreteProduct1
   */
  public factoryMethod(): Product {
    return new ConcreteProduct1();
  }
}

class ConcreteCreator2 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct2();
  }
}

/*
 * The client code works with an instance of a concrete creator, albeit through
 * its base interface. As long as the client keeps working with the creator via
 * the base interface, you can pass it any creator's subclass.
 * Returns result of `creator.someOperation()`
 */
function getProduct(creator: Creator): string {
  return creator.someOperation();
}

function throw403Error() {
  throw new Error('Status: 403. Product not found.');
}

// route handler: GET request to products/:id
export function getProductById(id: any) {
  if (id === 'a') {
    return getProduct(new ConcreteCreator1());
  }

  if (id === 'b') {
    return getProduct(new ConcreteCreator2());
  }

  throw403Error();
}

/* eslint-disable */
function getProductByIdWithoutFactory(id: any) {
  if (id === 'a') {
    const product = new ConcreteProduct1();
    return `Just created a ${product.operation()}`;
  }

  if (id === 'b') {
    const product = new ConcreteProduct2();
    return `Just created a ${product.operation()}`;
  }

  throw403Error();
}
/* eslint-enable */

export const name = 'Factory';
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const main = function () { };

