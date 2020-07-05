import { log } from '../utils';

/* eslint-disable no-useless-constructor, @typescript-eslint/no-empty-function */

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class Singleton {
  private static instance: Singleton;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /*
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  /**
   * Finally, any singleton should define some business logic, which can be
   * executed on its instance.
   */
  public someBusinessLogic() {
    // ...
    log('this is my business logic');
  }
}
/* eslint-enable no-useless-constructor @typescript-eslint/no-empty-function */

/*
 * The client code.
 */
function main() {
  const s1 = Singleton.getInstance();
  const s2 = Singleton.getInstance();

  if (s1 === s2) {
    log('s1 ===s2: Singleton works, both variables contain the same instance.');
  } else {
    log('Singleton failed, variables contain different instances.');
  }

  s1.someBusinessLogic();
}

const name = 'Singleton';

export { name, main };
