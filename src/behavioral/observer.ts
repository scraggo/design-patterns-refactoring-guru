import { log } from '../utils';
const INITIAL_STATE = 0;

/**
 * The Subject interface declares a set of methods for managing subscribers.
 */
export interface Subject<T> {
  state: T;

  // Attach an observer to the subject.
  attach(observer: Observer<T>): void;

  // Detach an observer from the subject.
  detach(observer: Observer<T>): void;

  // Notify all observers about an event.
  notify(): void;
}

/**
 * The Subject owns some important state and notifies observers when the state
 * changes.
 */
export class ConcreteSubject implements Subject<number> {
  /**
   * @type {number} For the sake of simplicity, the Subject's state, essential
   * to all subscribers, is stored in this variable.
   */
  public state: number = INITIAL_STATE;

  /**
   * @type {Observer[]} List of subscribers. In real life, the list of
   * subscribers can be stored more comprehensively (categorized by event
   * type, etc.).
   */
  private observers: Observer<number>[] = [];

  /*
   * The subscription management methods.
   */
  public attach(observer: Observer<number>): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return log('Subject: Observer has been attached already.');
    }

    log('Subject: Attached an observer.');
    this.observers.push(observer);
  }

  public detach(observer: Observer<number>): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    log('Subject: Detached an observer.');
  }

  /**
   * Trigger an update in each subscriber.
   */
  public notify(): void {
    log('Subject: Notifying observers...');
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * Usually, the subscription logic is only a fraction of what a Subject can
   * really do. Subjects commonly hold some important business logic, that
   * triggers a notification method whenever something important is about to
   * happen (or after it).
   */
  public someBusinessLogic(): void {
    log("\nSubject: I'm doing something important.");
    this.state = Math.floor(Math.random() * (10 + 1));

    log(`Subject: My state has just changed to: ${this.state}`);
    this.notify();
  }
}

/**
 * The Observer interface declares the update method, used by subjects.
 */
export interface Observer<T> {
  // Receive update from subject.
  update(subject: Subject<T>): void;
}

/**
 * Concrete Observers react to the updates issued by the Subject they had been
 * attached to.
 */
export class ConcreteObserverA implements Observer<number> {
  public update(subject: Subject<number>): void {
    if (subject.state < 3) {
      log('ConcreteObserverA: Reacted to the event.');
    }
  }
}

export class ConcreteObserverB implements Observer<number> {
  public update(subject: Subject<number>): void {
    if (subject.state === 0 || subject.state >= 2) {
      log('ConcreteObserverB: Reacted to the event.');
    }
  }
}

export function main() {
  /**
   * The client code.
   */
  const subject = new ConcreteSubject();

  const observer1 = new ConcreteObserverA();
  subject.attach(observer1);

  const observer2 = new ConcreteObserverB();
  subject.attach(observer2);

  subject.someBusinessLogic();
  subject.someBusinessLogic();

  subject.detach(observer2);

  subject.someBusinessLogic();
}

export const name = 'Observer';
