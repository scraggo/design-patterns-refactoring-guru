import { log } from '../utils';

/**
 * The Abstraction defines the interface for the "control" part of the two class
 * hierarchies. It maintains a reference to an object of the Implementation
 * hierarchy and delegates all of the real work to this object.
 */
export class Abstraction {
  protected implementation: Implementation;

  constructor(implementation: Implementation) {
    this.implementation = implementation;
  }

  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `Abstraction: Base operation with:\n${result}`;
  }
}

/**
 * You can extend the Abstraction without changing the Implementation classes.
 */
export class ExtendedAbstraction extends Abstraction {
  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `ExtendedAbstraction: Extended operation with:\n${result}`;
  }
}

/**
 * The Implementation defines the interface for all implementation classes. It
 * doesn't have to match the Abstraction's interface. In fact, the two
 * interfaces can be entirely different. Typically the Implementation interface
 * provides only primitive operations, while the Abstraction defines higher-
 * level operations based on those primitives.
 */
export interface Implementation {
  operationImplementation(): string;
}

/**
 * Each Concrete Implementation corresponds to a specific platform and
 * implements the Implementation interface using that platform's API.
 */
export class ConcreteImplementationA implements Implementation {
  public operationImplementation(): string {
    return 'ConcreteImplementationA: Here\'s the result on the platform A.';
  }
}

export class ConcreteImplementationB implements Implementation {
  public operationImplementation(): string {
    return 'ConcreteImplementationB: Here\'s the result on the platform B.';
  }
}

/*
 * Except for the initialization phase, where an Abstraction object gets linked
 * with a specific Implementation object, the client code should only depend on
 * the Abstraction class. This way the client code can support any abstraction-
 * implementation combination.
 */
function clientCode(abstraction: Abstraction) {
  // ..

  const result = abstraction.operation();
  log(result);
  return result;

  // ..
}

export function main() {
  /**
   * The client code should be able to work with any pre-configured abstraction-
   * implementation combination.
   */
  let implementation = new ConcreteImplementationA();
  let abstraction = new Abstraction(implementation);
  clientCode(abstraction);

  implementation = new ConcreteImplementationB();
  abstraction = new ExtendedAbstraction(implementation);
  clientCode(abstraction);
}

export const name = 'Bridge';
