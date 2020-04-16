import { getLogger } from '../utils';

const log = getLogger(false);

/**
 * The Handler interface declares a method for building the chain of handlers.
 * It also declares a method for executing a request.
 */
interface Handler {
  setNext(handler: Handler): Handler;

  handle(request: string): string | null;
}

/**
* The default chaining behavior can be implemented inside a base handler class.
*/
abstract class AbstractHandler implements Handler {
  private nextHandler: Handler | null = null;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    // Returning a handler from here will let us link handlers in a
    // convenient way like this:
    // monkey.setNext(squirrel).setNext(dog);
    return handler;
  }

  public handle(request: string) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return null;
  }
}

/**
* All Concrete Handlers either handle a request or pass it to the next handler
* in the chain.
*/
class MonkeyHandler extends AbstractHandler {
  public handle(request: string) {
    log.debug(request);
    if (request === 'Banana') {
      return `Monkey: I'll eat the ${request}.`;
    }

    return super.handle(request);
  }
}

class SquirrelHandler extends AbstractHandler {
  public handle(request: string) {
    log.debug(request);
    if (request === 'Nut') {
      return `Squirrel: I'll eat the ${request}.`;
    }

    return super.handle(request);
  }
}

class DogHandler extends AbstractHandler {
  public handle(request: string) {
    log.debug(request);
    if (request === 'Meatball') {
      return `Dog: I'll eat the ${request}.`;
    }

    return super.handle(request);
  }
}

/*
* The client code is usually suited to work with a single handler. In most
* cases, it is not even aware that the handler is part of a chain.
*/
function clientCode(handler: Handler, foods: string[]) {
  for (const food of foods) {
    log(`Client: Who wants a ${food}?`);

    const result = handler.handle(food);
    if (result) {
      log(`  ${result}`);
    } else {
      log(`  ${food} was left untouched.`);
    }
  }
}

function chain1() {
  /**
    * The other part of the client code constructs the actual chain.
    */
  const monkey = new MonkeyHandler();
  const squirrel = new SquirrelHandler();
  const dog = new DogHandler();

  monkey.setNext(squirrel).setNext(dog);

  const foods = ['Nut', 'Banana', 'Cup of coffee'];
  /**
  * The client should be able to send a request to any handler, not just the
  * first one in the chain.
  */
  log('Chain: Monkey > Squirrel > Dog\n');
  clientCode(monkey, foods);
  log('');

  log('Subchain: Squirrel > Dog\n');
  clientCode(squirrel, foods);
  log('');
}

function chain2() {
  /**
    * The other part of the client code constructs the actual chain.
    */
  const dog = new DogHandler();
  const monkey = new MonkeyHandler();
  const squirrel = new SquirrelHandler();

  dog.setNext(squirrel).setNext(monkey);

  const foods = ['Nut', 'Banana', 'Cup of coffee', 'Meatball'];

  /**
  * The client should be able to send a request to any handler, not just the
  * first one in the chain.
  */
  log('Chain: Dog > Squirrel > Monkey\n');
  clientCode(dog, foods);
  log('');
}

export function main() {
  chain1();
  chain2();
}

export const name = 'Chain of Responsibility';
