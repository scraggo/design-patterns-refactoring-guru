import { log } from '../utils';

/**
 * The Abstract Class defines a template method that contains a skeleton of some
 * algorithm, composed of calls to (usually) abstract primitive operations.
 *
 * Concrete subclasses should implement these operations, but leave the template
 * method itself intact.
 */
abstract class AbstractClass {
  /**
   * The template method defines the skeleton of an algorithm.
   */
  public templateMethod(): void {
    this.baseOperation1();
    this.requiredOperations1();
    this.baseOperation2();
    this.hook1();
    this.requiredOperation2();
    this.baseOperation3();
    this.hook2();
  }

  /**
   * These operations already have implementations.
   */
  protected baseOperation1(): void {
    log('AbstractClass says: I am doing the bulk of the work');
  }

  protected baseOperation2(): void {
    log('AbstractClass says: But I let subclasses override some operations');
  }

  protected baseOperation3(): void {
    log('AbstractClass says: But I am doing the bulk of the work anyway');
  }

  /**
   * These operations have to be implemented in subclasses.
   */
  protected abstract requiredOperations1(): void;

  protected abstract requiredOperation2(): void;

  /**
   * These are "hooks." Subclasses may override them, but it's not mandatory
   * since the hooks already have default (but empty) implementation. Hooks
   * provide additional extension points in some crucial places of the
   * algorithm.
   */
  protected hook1(): void {
    // empty
  }

  protected hook2(): void {
    // empty
  }
}

/**
 * Concrete classes have to implement all abstract operations of the base class.
 * They can also override some operations with a default implementation.
 */
class ConcreteClass1 extends AbstractClass {
  protected requiredOperations1(): void {
    log('ConcreteClass1 says: Implemented Operation1');
  }

  protected requiredOperation2(): void {
    log('ConcreteClass1 says: Implemented Operation2');
  }
}

/**
 * Usually, concrete classes override only a fraction of base class' operations.
 */
class ConcreteClass2 extends AbstractClass {
  protected requiredOperations1(): void {
    log('ConcreteClass2 says: Implemented Operation1');
  }

  protected requiredOperation2(): void {
    log('ConcreteClass2 says: Implemented Operation2');
  }

  protected hook1(): void {
    log('ConcreteClass2 says: Overridden Hook1');
  }
}

/*
 * The client code calls the template method to execute the algorithm. Client
 * code does not have to know the concrete class of an object it works with, as
 * long as it works with objects through the interface of their base class.
 */
function clientCode(abstractClass: AbstractClass) {
  // ...
  abstractClass.templateMethod();
  // ...
}

export function main() {
  log('Same client code can work with different subclasses:');
  clientCode(new ConcreteClass1());
  log('');

  log('Same client code can work with different subclasses:');
  clientCode(new ConcreteClass2());
}

export const name = 'Template Method';
