import { log } from '../utils';

/**
 * The Memento interface provides a way to retrieve the memento's metadata, such
 * as creation date or name. However, it doesn't expose the Originator's state.
 */
interface Memento {
  getState(): string;

  getName(): string;

  getDate(): string;
}

/**
 * The Concrete Memento contains the infrastructure for storing the Originator's
 * state.
 */
class ConcreteMemento implements Memento {
  private state: string;

  private date: string;

  constructor(state: string) {
    this.state = state;
    this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  /*
   * The Originator uses this method when restoring its state.
   */
  public getState(): string {
    return this.state;
  }

  /*
   * The rest of the methods are used by the Caretaker to display metadata.
   */
  public getName(): string {
    return `${this.date} / (${this.state.substr(0, 9)}...)`;
  }

  public getDate(): string {
    return this.date;
  }
}

/**
 * The Originator holds some important state that may change over time. It also
 * defines a method for saving the state inside a memento and another method for
 * restoring the state from it.
 */
class Originator {
  /**
   * For the sake of simplicity, the originator's state is stored inside a
   * single variable.
   */
  private state: string;

  constructor(state: string) {
    this.state = state;
    log(`Originator: My initial state is: ${state}`);
  }

  /**
   * The Originator's business logic may affect its internal state. Therefore,
   * the client should backup the state before launching methods of the
   * business logic via the save() method.
   */
  public doSomething(): void {
    log("Originator: I'm doing something important.");
    this.state = this.generateRandomString(30);
    log(`Originator: and my state has changed to: ${this.state}`);
  }

  private generateRandomString(length = 10): string {
    const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return new Array(length)
      .fill('')
      .map(() => charSet.charAt(Math.floor(Math.random() * charSet.length)))
      .join('');
  }

  /*
   * Saves the current state inside a memento.
   */
  public save(): Memento {
    return new ConcreteMemento(this.state);
  }

  /*
   * Restores the Originator's state from a memento object.
   */
  public restore(memento: Memento): void {
    this.state = memento.getState();
    log(`Originator: My state has changed to: ${this.state}`);
  }
}

/**
 * The Caretaker doesn't depend on the Concrete Memento class. Therefore, it
 * doesn't have access to the originator's state, stored inside the memento. It
 * works with all mementos via the base Memento interface.
 */
class Caretaker {
  private mementos: Memento[] = [];

  private originator: Originator;

  constructor(originator: Originator) {
    this.originator = originator;
  }

  public backup(): void {
    log("\nCaretaker: Saving Originator's state...");
    this.mementos.push(this.originator.save());
  }

  public undo(): void {
    if (this.mementos.length === 0) {
      log('Caretaker: Nothing left to undo.');
      return;
    }

    const memento = this.mementos.pop() as Memento;

    log(`Caretaker: Restoring state to: ${memento.getName()}`);
    this.originator.restore(memento);
  }

  public showHistory(): void {
    log("Caretaker: Here's the list of mementos:");
    for (const memento of this.mementos) {
      log(memento.getName());
    }
  }
}

export function main() {
  /**
   * Client code.
   */
  const originator = new Originator('Super-duper-super-puper-super.');
  const caretaker = new Caretaker(originator);

  caretaker.backup();
  originator.doSomething();

  caretaker.backup();
  originator.doSomething();

  caretaker.backup();
  originator.doSomething();

  log('');
  caretaker.showHistory();

  log("\nClient: Now, let's rollback!\n");
  caretaker.undo();

  log('\nClient: Once more!\n');
  caretaker.undo();

  log('\nClient: Once more!\n');
  caretaker.undo();

  log('\nClient: Once more!\n');
  caretaker.undo();
}

export const name = 'Memento';
